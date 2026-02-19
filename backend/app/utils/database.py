from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from datetime import datetime
from bson import ObjectId

import certifi

class Database:
    """Handles all database operations"""
    
    def __init__(self):
        # Connect to MongoDB
        mongodb_uri = os.getenv("MONGODB_URI")
        self.client = AsyncIOMotorClient(mongodb_uri, tlsCAFile=certifi.where())
        self.db = self.client.career_navigator
        
    async def save_resume(self, resume_data: dict) -> str:
        """Save parsed resume to database
        
        Args:
            resume_data: Dictionary with resume information
            
        Returns:
            user_id: Unique ID for this user
        """
        resume_data['uploaded_at'] = datetime.now()
        result = await self.db.resumes.insert_one(resume_data)
        return str(result.inserted_id)
    
    async def get_resume(self, user_id: str) -> dict:
        """Get resume by user ID"""
        return await self.db.resumes.find_one({"_id": ObjectId(user_id)})
    
    async def save_skill_analysis(self, user_id: str, analysis: dict):
        """Save skill gap analysis"""
        analysis['user_id'] = user_id
        analysis['created_at'] = datetime.now()
        await self.db.skill_analyses.update_one(
            {"user_id": user_id},
            {"$set": analysis},
            upsert=True  # Create if doesn't exist, update if exists
        )
    
    async def get_skill_analysis(self, user_id: str) -> dict:
        """Get skill analysis for user"""
        return await self.db.skill_analyses.find_one({"user_id": user_id})
    
    
    async def save_roadmap(self, user_id: str, roadmap: dict, display_name: str = None, is_active: bool = True):
        """Save learning roadmap - supports multiple roadmaps per user
        
        Args:
            user_id: User identifier
            roadmap: Roadmap data
            display_name: Optional friendly name for the roadmap
            is_active: Whether this is the active roadmap
        
        Returns:
            roadmap_id: ID of the saved roadmap
        """
        # If this is marked as active, deactivate all other roadmaps for this user
        if is_active:
            await self.db.roadmaps.update_many(
                {"user_id": user_id},
                {"$set": {"is_active": False}}
            )
        
        roadmap_doc = {
            **roadmap,
            "user_id": user_id,
            "created_at": datetime.now(),
            "is_active": is_active,
            "display_name": display_name or roadmap.get("target_role", "Unnamed Roadmap")
        }
        
        result = await self.db.roadmaps.insert_one(roadmap_doc)
        return str(result.inserted_id)
    
    async def get_roadmap(self, user_id: str) -> dict:
        """Get active roadmap for user"""
        return await self.db.roadmaps.find_one(
            {"user_id": user_id, "is_active": True}
        )
    
    async def get_user_roadmaps(self, user_id: str) -> list:
        """Get all roadmaps for a user"""
        cursor = self.db.roadmaps.find({"user_id": user_id}).sort("created_at", -1)
        roadmaps = await cursor.to_list(length=100)
        # Convert ObjectId to string for JSON serialization
        for rm in roadmaps:
            rm['_id'] = str(rm['_id'])
        return roadmaps
    
    async def get_roadmap_by_id(self, roadmap_id: str) -> dict:
        """Get specific roadmap by ID"""
        roadmap = await self.db.roadmaps.find_one({"_id": ObjectId(roadmap_id)})
        if roadmap:
            roadmap['_id'] = str(roadmap['_id'])
        return roadmap
    
    async def update_roadmap(self, roadmap_id: str, updates: dict):
        """Update roadmap properties
        
        Args:
            roadmap_id: Roadmap identifier
            updates: Dictionary of fields to update
        """
        # Handle is_active flag - deactivate others if setting this one as active
        if updates.get("is_active") == True:
            roadmap = await self.get_roadmap_by_id(roadmap_id)
            if roadmap:
                await self.db.roadmaps.update_many(
                    {"user_id": roadmap["user_id"], "_id": {"$ne": ObjectId(roadmap_id)}},
                    {"$set": {"is_active": False}}
                )
        
        await self.db.roadmaps.update_one(
            {"_id": ObjectId(roadmap_id)},
            {"$set": updates}
        )
    
    async def delete_roadmap(self, roadmap_id: str):
        """Delete a roadmap"""
        await self.db.roadmaps.delete_one({"_id": ObjectId(roadmap_id)})
    
    async def get_roadmaps_by_ids(self, roadmap_ids: list) -> list:
        """Batch fetch roadmaps for comparison
        
        Args:
            roadmap_ids: List of roadmap IDs
            
        Returns:
            List of roadmap documents
        """
        object_ids = [ObjectId(rid) for rid in roadmap_ids]
        cursor = self.db.roadmaps.find({"_id": {"$in": object_ids}})
        roadmaps = await cursor.to_list(length=len(roadmap_ids))
        # Convert ObjectId to string
        for rm in roadmaps:
            rm['_id'] = str(rm['_id'])
        return roadmaps

    
    # Chat History Methods
    async def save_chat_message(self, user_id: str, roadmap_id: str, role: str, message: str):
        """Save a chat message to history
        
        Args:
            user_id: User identifier  
            roadmap_id: Associated roadmap ID
            role: 'user' or 'assistant'
            message: Message content
        """
        chat_message = {
            "user_id": user_id,
            "roadmap_id": roadmap_id,
            "role": role,
            "message": message,
            "timestamp": datetime.now()
        }
        await self.db.chat_history.insert_one(chat_message)
    
    async def get_chat_history(self, user_id: str, roadmap_id: str = None, limit: int = 50):
        """Get chat history for a user
        
        Args:
            user_id: User identifier
            roadmap_id: Optional roadmap filter
            limit: Maximum messages to return
            
        Returns:
            List of chat messages
        """
        query = {"user_id": user_id}
        if roadmap_id:
            query["roadmap_id"] = roadmap_id
        
        cursor = self.db.chat_history.find(query).sort("timestamp", 1).limit(limit)
        messages = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for msg in messages:
            msg['_id'] = str(msg['_id'])
        
        return messages
    
    async def clear_chat_history(self, user_id: str, roadmap_id: str = None):
        """Clear chat history
        
        Args:
            user_id: User identifier
            roadmap_id: Optional - clear only for specific roadmap
        """
        query = {"user_id": user_id}
        if roadmap_id:
            query["roadmap_id"] = roadmap_id
        
        await self.db.chat_history.delete_many(query)

    
    # Interview Session Methods
    async def save_interview_session(self, user_id: str, session_data: dict) -> str:
        """Save interview practice session
        
        Args:
            user_id: User identifier
            session_data: Interview session data including questions and answers
            
        Returns:
            session_id: ID of the saved session
        """
        session_doc = {
            **session_data,
            "user_id": user_id,
            "created_at": datetime.now()
        }
        
        result = await self.db.interview_sessions.insert_one(session_doc)
        return str(result.inserted_id)
    
    async def get_interview_sessions(self, user_id: str, limit: int = 10) -> list:
        """Get user's interview history
        
        Args:
            user_id: User identifier
            limit: Maximum sessions to return
            
        Returns:
            List of interview sessions
        """
        cursor = self.db.interview_sessions.find(
            {"user_id": user_id}
        ).sort("created_at", -1).limit(limit)
        
        sessions = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for session in sessions:
            session['_id'] = str(session['_id'])
        
        return sessions
    
    async def get_interview_session(self, session_id: str) -> dict:
        """Get specific interview session by ID
        
        Args:
            session_id: Session identifier
            
        Returns:
            Interview session document
        """
        session = await self.db.interview_sessions.find_one(
            {"_id": ObjectId(session_id)}
        )
        
        if session:
            session['_id'] = str(session['_id'])
        
        return session

