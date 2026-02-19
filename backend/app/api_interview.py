from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.utils.database import Database
from app.services.ai_service import AIService
from app.dependencies import get_db, get_ai_service
from bson import ObjectId

router = APIRouter()


class InterviewRequest(BaseModel):
    target_role: str
    difficulty: str = "medium"
    question_count: int = 5
    roadmap_id: Optional[str] = None


class AnswerSubmission(BaseModel):
    question: str
    answer: str
    category: str


class SessionSubmission(BaseModel):
    answers: List[AnswerSubmission]


@router.post("/interview/generate/{user_id}")
async def generate_interview(
    user_id: str, 
    request: InterviewRequest,
    db: Database = Depends(get_db),
    ai_service: AIService = Depends(get_ai_service)
):
    """Generate new interview session with questions
    
    Args:
        user_id: User identifier
        request: Interview generation parameters
        
    Returns:
        Session with generated questions
    """
    try:
        # Generate questions using AI
        questions = await ai_service.generate_interview_questions(
            target_role=request.target_role,
            difficulty=request.difficulty,
            count=request.question_count
        )
        
        # Create session document (without answers yet)
        session_data = {
            "target_role": request.target_role,
            "difficulty": request.difficulty,
            "roadmap_id": request.roadmap_id,
            "questions": [
                {
                    **q,
                    "user_answer": "",
                    "ai_feedback": "",
                    "score": 0
                }
                for q in questions
            ],
            "overall_score": 0,
            "status": "in_progress"
        }
        
        session_id = await db.save_interview_session(user_id, session_data)
        
        return {
            "session_id": session_id,
            "questions": questions,
            "target_role": request.target_role,
            "difficulty": request.difficulty
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/interview/submit/{session_id}")
async def submit_answers(
    session_id: str, 
    submission: SessionSubmission,
    db: Database = Depends(get_db),
    ai_service: AIService = Depends(get_ai_service)
):
    """Submit answers and get AI feedback
    
    Args:
        session_id: Interview session ID
        submission: List of questions with answers
        
    Returns:
        Evaluated session with scores and feedback
    """
    try:
        # Get existing session
        session = await db.get_interview_session(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Evaluate each answer
        evaluated_questions = []
        total_score = 0
        
        for answer_submission in submission.answers:
            # Get AI evaluation
            evaluation = await ai_service.evaluate_interview_answer(
                question=answer_submission.question,
                user_answer=answer_submission.answer,
                category=answer_submission.category
            )
            
            # Find matching question and update it
            for q in session["questions"]:
                if q["question"] == answer_submission.question:
                    q["user_answer"] = answer_submission.answer
                    q["ai_feedback"] = evaluation.get("feedback", "")
                    q["score"] = evaluation.get("score", 0)
                    q["strengths"] = evaluation.get("strengths", [])
                    q["improvements"] = evaluation.get("improvements", [])
                    break
            
            total_score += evaluation.get("score", 0)
        
        # Calculate overall score percentage
        overall_score = round((total_score / (len(submission.answers) * 10)) * 100, 1)
        
        # Update session with answers and evaluations
        
        await db.db.interview_sessions.update_one(
            {"_id": ObjectId(session_id)},
            {
                "$set": {
                    "questions": session["questions"],
                    "overall_score": overall_score,
                    "status": "completed"
                }
            }
        )
        
        return {
            "session_id": session_id,
            "questions": session["questions"],
            "overall_score": overall_score,
            "total_questions": len(submission.answers)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interview/history/{user_id}")
async def get_interview_history(
    user_id: str, 
    limit: int = 10,
    db: Database = Depends(get_db)
):
    """Get past interview sessions
    
    Args:
        user_id: User identifier
        limit: Maximum sessions to return
        
    Returns:
        List of past interview sessions
    """
    try:
        sessions = await db.get_interview_sessions(user_id, limit=limit)
        return {"sessions": sessions}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/interview/session/{session_id}")
async def get_session_details(
    session_id: str,
    db: Database = Depends(get_db)
):
    """Get specific interview session details
    
    Args:
        session_id: Session identifier
        
    Returns:
        Complete session data with questions, answers, and feedback
    """
    try:
        session = await db.get_interview_session(session_id)
        
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
        
        return session
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
