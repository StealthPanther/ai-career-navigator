import pdfplumber
from typing import Dict
from app.services.ai_service import AIService

class ResumeParser:
    """Handles PDF resume uploads and parsing"""
    
    def __init__(self):
        self.ai_service = AIService()
    
    def extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file
        
        Args:
            file_path: Path to the PDF file
            
        Returns:
            Extracted text as string
        """
        text = ""
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            raise
        
        return text
    
    async def parse_resume(self, file_path: str) -> Dict:
        """Complete resume parsing pipeline
        
        1. Extract text from PDF
        2. Send to AI for structured extraction
        3. Return parsed data
        """
        # Step 1: Extract text
        resume_text = self.extract_text_from_pdf(file_path)
        
        if not resume_text or len(resume_text) < 50:
            raise ValueError("Could not extract meaningful text from PDF")
        
        # Step 2: Parse with AI
        parsed_data = await self.ai_service.parse_resume(resume_text)
        
        return parsed_data
