from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from app.utils.database import Database
from app.services.ai_service import AIService
from app.dependencies import get_db, get_ai_service

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    roadmap_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str

@router.post("/chat/{user_id}")
async def chat_with_ai(
    user_id: str, 
    chat: ChatMessage,
    db: Database = Depends(get_db),
    ai_service: AIService = Depends(get_ai_service)
):
    """Chat with AI Study Buddy
    
    Gets context from user's roadmap and provides helpful responses
    """
    try:
        # Save user message
        await db.save_chat_message(user_id, chat.roadmap_id or "", "user", chat.message)
        
        # Get roadmap context if available
        context = ""
        if chat.roadmap_id:
            roadmap = await db.get_roadmap_by_id(chat.roadmap_id)
            if roadmap:
                context = f"""
User's Target Role: {roadmap.get('target_role', 'Unknown')}
Current Week: {roadmap.get('current_week', 1)} / {roadmap.get('total_weeks', 12)}
Job Readiness Score: {roadmap.get('job_readiness_score', 0)}%
Skills to Learn: {', '.join(roadmap.get('skills_to_learn', [])[:5])}
"""
        
        # Get recent chat history for context
        history = await db.get_chat_history(user_id, chat.roadmap_id, limit=10)
        chat_context = "\n".join([f"{msg['role']}: {msg['message']}" for msg in history[-5:]])
        
        # Validate input quality
        user_input = chat.message.strip()
        if len(user_input) < 2 or not any(c.isalpha() for c in user_input):
            # Handle very short or nonsensical input
            ai_response = "I'm here to help with your learning journey! Please ask me a specific question about your roadmap, skills, or career goals. For example: 'What should I learn first?' or 'How do I get started with Python?'"
        else:
            # Generate AI response with better prompt
            prompt = f"""You are an AI Study Buddy - a helpful, encouraging career coach helping someone learn new skills.

CONTEXT:
{context if context else "No specific roadmap loaded - provide general career advice"}

CONVERSATION HISTORY:
{chat_context if chat_context else "This is the start of the conversation"}

USER QUESTION: {user_input}

INSTRUCTIONS:
- If the question is vague or unclear, ask for clarification
- If it's about learning a skill, provide 2-3 actionable tips
- If it's about the roadmap, reference the specific weeks/skills mentioned above
- Be encouraging and specific
- Keep response to 2-4 sentences
- If user asks something unrelated to learning/careers, gently redirect them

YOUR RESPONSE:"""
            
            ai_response = await ai_service.generate_response(prompt)
        
        # Save AI response
        await db.save_chat_message(user_id, chat.roadmap_id or "", "assistant", ai_response)
        
        from datetime import datetime
        return ChatResponse(
            response=ai_response,
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/chat/history/{user_id}")
async def get_chat_history(
    user_id: str, 
    roadmap_id: Optional[str] = None,
    db: Database = Depends(get_db)
):
    """Get chat history for a user"""
    try:
        history = await db.get_chat_history(user_id, roadmap_id)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/chat/history/{user_id}")
async def clear_chat_history(
    user_id: str, 
    roadmap_id: Optional[str] = None,
    db: Database = Depends(get_db)
):
    """Clear chat history"""
    try:
        await db.clear_chat_history(user_id, roadmap_id)
        return {"success": True, "message": "Chat history cleared"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
