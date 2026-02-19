from app.services.ai_service import AIService
from app.services.resume_parser import ResumeParser
from app.utils.database import Database
import logging

# Configure logging
logger = logging.getLogger(__name__)

# Global instances (initialized lazily)
_ai_service = None
_db = None
_resume_parser = None

def get_resume_parser():
    """Dependency for Resume Parser"""
    global _resume_parser
    if _resume_parser is None:
        logger.info("Initializing ResumeParser...")
        _resume_parser = ResumeParser()
    return _resume_parser

def get_ai_service():
    """Dependency for AI Service"""
    global _ai_service
    if _ai_service is None:
        logger.info("Initializing AIService...")
        _ai_service = AIService()
    return _ai_service

def get_db():
    """Dependency for Database"""
    global _db
    if _db is None:
        logger.info("Initializing Database...")
        _db = Database()
    return _db
