from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
import logging
from pathlib import Path
from app.services.resume_parser import ResumeParser
from app.services.ai_service import AIService
from app.utils.database import Database
from app import api_chat  # Import chat routes
from app import api_interview  # Import interview routes
import os
from dotenv import load_dotenv
from bson import ObjectId
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="AI Career Navigator API",
    description="Intelligent career guidance with AI-powered skill analysis",
    version="1.0.0"
)

# CORS - Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ai-career-navigator.vercel.app",
        "https://ai-career-navigator-frontend.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.dependencies import get_db, get_ai_service, get_resume_parser

# Initialize services (optional warm-up during startup)
# We can trigger them here if we want them fast-failed on startup
# get_ai_service()
# get_db()

# Register routers
app.include_router(api_chat.router, prefix="/api", tags=["chat"])
app.include_router(api_interview.router, prefix="/api", tags=["interview"])

# Create uploads directory
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "AI Career Navigator API is running!",
        "version": "1.0.0"
    }


@app.post("/api/upload-resume")
async def upload_resume(
    file: UploadFile = File(...), 
    db: Database = Depends(get_db),
    resume_parser: ResumeParser = Depends(get_resume_parser)
):
    """
    Upload and parse resume PDF
    
    Returns:
        - Parsed resume data with user_id
    """
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")
        
        logger.info(f"Processing resume: {file.filename}")
        
        # Save uploaded file temporarily
        file_path = UPLOAD_DIR / file.filename
        
        logger.info("Saving file to disk...")
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Parse resume with AI
        logger.info("Starting resume parsing...")
        try:
            parsed_data = await resume_parser.parse_resume(str(file_path))
            logger.info(f"Resume parsed. Keys: {list(parsed_data.keys())}")
        except Exception as parse_error:
            logger.error(f"Parsing failed: {parse_error}")
            raise HTTPException(status_code=500, detail=f"Parsing failed: {str(parse_error)}")
        
        # Save to database
        logger.info("Saving to database...")
        user_id = await db.save_resume(parsed_data)
        parsed_data['user_id'] = user_id
        
        logger.info(f"Resume parsed successfully. User ID: {user_id}")
        
        # Clean up uploaded file
        try:
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Cleaned up temporary file: {file_path}")
        except Exception as cleanup_error:
            logger.warning(f"Failed to clean up temporary file {file_path}: {cleanup_error}")
        
        return JSONResponse(content=jsonable_encoder(parsed_data, custom_encoder={ObjectId: str}))
        
    except Exception as e:
        # Ensure cleanup even on error
        try:
            if 'file_path' in locals() and file_path.exists():
                file_path.unlink()
        except Exception:
            pass
        logger.error(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/analyze-skills")
async def analyze_skills(
    user_id: str = Form(...), 
    target_role: str = Form(...),
    db: Database = Depends(get_db),
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Analyze skill gaps for target role
    
    Returns:
        - Skill gap analysis with job readiness score
    """
    try:
        logger.info(f"Analyzing skills for user {user_id}, target: {target_role}")
        
        # Get user resume from database
        resume = await db.get_resume(user_id)
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        current_skills = resume.get('skills', [])
        
        # Analyze gaps with AI
        analysis = await ai_service.analyze_skill_gap(current_skills, target_role)
        
        # Calculate job readiness score
        required_count = len(analysis['required_skills'])
        matching_count = len(analysis['matching_skills'])
        job_readiness = (matching_count / required_count * 100) if required_count > 0 else 0
        
        # Ensure trending_skills_comparison exists (use AI's detailed data if available)
        if 'trending_skills_comparison' not in analysis or not isinstance(analysis['trending_skills_comparison'], dict):
            # Fallback only if AI didn't provide the detailed comparison
            logger.warning("AI didn't provide trending_skills_comparison, using fallback")
            trending_comparison = {
                skill: {"has_skill": skill in current_skills} 
                for skill in analysis.get('trending_skills', [])
            }
            analysis['trending_skills_comparison'] = trending_comparison
        else:
            logger.info(f"Using AI-generated trending_skills_comparison with {len(analysis['trending_skills_comparison'])} skills")
        
        # Build complete analysis
        complete_analysis = {
            **analysis,
            "job_readiness_score": round(job_readiness, 1),
            "target_role": target_role
        }
        
        # Save analysis to database
        await db.save_skill_analysis(user_id, complete_analysis)
        
        logger.info(f"Skill analysis complete. Readiness: {job_readiness}%")
        logger.info(f"   Trending skills comparison keys: {list(complete_analysis.get('trending_skills_comparison', {}).keys())}")
        
        return JSONResponse(content=jsonable_encoder(complete_analysis, custom_encoder={ObjectId: str}))
        
    except Exception as e:
        logger.error(f"Error analyzing skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate-roadmap")
async def generate_roadmap(
    user_id: str = Form(...), 
    target_role: str = Form(...), 
    weeks: int = Form(12),
    db: Database = Depends(get_db),
    ai_service: AIService = Depends(get_ai_service)
):
    """
    Generate personalized learning roadmap
    
    Returns:
        - Week-by-week learning plan with resources
    """
    try:
        logger.info(f"Generating {weeks}-week roadmap for {target_role}")
        
        # Get skill analysis
        analysis = await db.get_skill_analysis(user_id)
        
        if not analysis:
            raise HTTPException(
                status_code=404, 
                detail="Please complete skill analysis first"
            )
        
        missing_skills = analysis.get('missing_skills', [])
        logger.info(f"Missing skills to focus on: {missing_skills[:3]}..." if len(missing_skills) > 3 else f"Missing skills: {missing_skills}")
        
        # Generate roadmap with AI
        roadmap_data = await ai_service.generate_roadmap(
            missing_skills, 
            target_role, 
            weeks
        )
        
        # Debug: Log the first few week numbers from AI response
        if 'weekly_plan' in roadmap_data:
            week_numbers = [week.get('week', '?') for week in roadmap_data['weekly_plan'][:5]]
            logger.info(f"AI returned {len(roadmap_data['weekly_plan'])} weeks. First 5 week numbers: {week_numbers}")
        else:
            logger.warning("AI response missing 'weekly_plan' key!")
        
        # Add metadata
        complete_roadmap = {
            **roadmap_data,
            "user_id": user_id,
            "target_role": target_role,
            "total_weeks": weeks,
            "job_readiness_score": analysis.get('job_readiness_score', 0),
            "skills_to_learn": missing_skills
        }
        
        # Save roadmap to database (creates new roadmap each time)
        roadmap_id = await db.save_roadmap(
            user_id, 
            complete_roadmap, 
            display_name=target_role,  # Use target role as display name
            is_active=True  # Make this the active roadmap
        )
        
        logger.info(f"Roadmap saved to database for user {user_id}")
        
        return JSONResponse(content=jsonable_encoder(complete_roadmap, custom_encoder={ObjectId: str}))
        
    except Exception as e:
        logger.error(f"Error generating roadmap: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/dashboard/{user_id}")
async def get_dashboard(user_id: str, db: Database = Depends(get_db)):
    """
    Get complete dashboard data for user
    
    Returns:
        - Resume, skill analysis, and roadmap
    """
    try:
        resume = await db.get_resume(user_id)
        analysis = await db.get_skill_analysis(user_id)
        roadmap = await db.get_roadmap(user_id)
        
        return JSONResponse(content=jsonable_encoder({
            "resume": resume,
            "skill_analysis": analysis,
            "roadmap": roadmap
        }, custom_encoder={ObjectId: str}))
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Run server
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
