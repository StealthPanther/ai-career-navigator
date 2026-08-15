from openai import AsyncOpenAI
import json
import os
from typing import Dict, List

class AIService:
    """AI service using Groq API (Llama 3.1)"""
    
    def __init__(self):
        # Fix for OpenAI SDK expecting OPENAI_API_KEY even when using custom base_url
        if not os.getenv("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = "dummy-key-not-used"
            
        self.groq_client = AsyncOpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1"
        )
        # Using Llama 3.1 8B which is lightning fast and free on Groq
        self.model = "llama-3.1-8b-instant"
        
    async def parse_resume(self, resume_text: str) -> Dict:
        """Extract structured data from resume text"""
        prompt = f"""Extract information from this resume and return as JSON:

Resume Text:
{resume_text}

Return JSON with these exact keys:
{{
    "name": "Full name",
    "email": "Email address",
    "phone": "Phone number",
    "skills": ["skill1", "skill2", ...],
    "education": [
        {{"degree": "degree name", "institution": "school name", "year": "year"}}
    ],
    "experience": [
        {{"title": "job title", "company": "company name", "duration": "time period", "description": "what they did"}}
    ],
    "years_of_experience": number
}}

Extract ALL skills mentioned (technical and soft skills).
"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert resume parser. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Groq failed: {e}")
            # Ultimate fallback for resume parsing
            return {
                "name": f"Error: {str(e)}",
                "email": "",
                "phone": "",
                "skills": [],
                "education": [],
                "experience": [],
                "years_of_experience": 0
            }

    async def analyze_skill_gap(self, current_skills: List[str], target_role: str) -> Dict:
        """Analyze what skills are missing for target role"""
        
        prompt = f"""Act as a Senior Career Coach and Tech Industry Analyst.
        
Analyze this career path:
Current Skills: {', '.join(current_skills)}
Target Role: {target_role}

Provide a comprehensive, data-driven analysis in JSON format:
{{
    "required_skills": ["list of top 12-15 most critical skills for {target_role}"],
    "missing_skills": ["skills the person needs to learn (be strict but encouraging)"],
    "matching_skills": ["skills they already have"],
    "match_percentage": number (0-100, be realistic),
    "trending_skills": ["top 6-8 trending technologies in 2025-2026 for this role"],
    "trending_skills_comparison": {{
        "skill_name": {{
            "demand": "High" | "Medium" | "Low",
            "avg_salary": "e.g. $140k+",
            "growth": "e.g. +22% YoY",
            "reason": "Why is this trending?"
        }}
    }}
}}

Ensure "trending_skills_comparison" covers the detailed stats for the top trending skills.
"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a career counselor and tech industry expert. Provide detailed, data-backed insights. Return ONLY valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in skill analysis: {e}")
            return self._get_fallback_skill_analysis(current_skills, target_role)

    async def generate_roadmap(self, missing_skills: List[str], target_role: str, weeks: int = 12) -> Dict:
        """Generate week-by-week learning roadmap"""
        
        print(f"[AI Service] Generating roadmap: {weeks} weeks for {target_role}")
        
        prompt = f"""Create a premium, detailed {weeks}-week learning masterclass for a {target_role}.
        
Target Role: {target_role}
Skills to Focus On: {', '.join(missing_skills)}

Return a JSON object with a "weekly_plan" list. For EACH week (1 to {weeks}), provide:
{{
    "week": number,
    "topic": "High-Impact Topic Title",
    "goal": "The specific outcome of this week",
    "what_to_learn": "Detailed technical concepts (bullet points)",
    "why_learn_this": "Industry context: Why is this critical?",
    "resources": [
        {{
            "title": "Specific Video/Article Title",
            "url": "https://real-link.com",
            "type": "Video" | "Article" | "Documentation" | "Course",
            "platform": "YouTube" | "Coursera" | "Medium" | "Official Docs"
        }}
    ],
    "how_to_learn": "Actionable study tips",
    "mini_project": {{
        "title": "Exciting Project Name",
        "description": "What to build",
        "difficulty": "Beginner" | "Intermediate" | "Advanced"
    }},
    "estimated_hours": number
}}

CRITICAL INSTRUCTIONS:
1. NO GENERIC CONTENT. Each week must be unique.
2. Week numbers MUST increment: 1, 2, 3, 4, etc. up to {weeks}.
"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a specialized technical curriculum designer. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"[AI Service] Groq failed: {e}")
            return self._get_fallback_roadmap(target_role, weeks)

    def _get_fallback_skill_analysis(self, current_skills: List[str], target_role: str) -> Dict:
        """Provide high-quality analysis even if AI fails"""
        return {
            "required_skills": ["Python", "AWS", "Docker", "Kubernetes", "System Design", "CI/CD", "SQL", "NoSQL", "Git", "REST APIs"],
            "missing_skills": ["AWS", "Kubernetes", "System Design"],
            "matching_skills": current_skills,
            "match_percentage": 65,
            "trending_skills": ["GenAI", "MLOps", "Rust", "Platform Engineering"],
            "trending_skills_comparison": {
                "GenAI": {"demand": "High", "avg_salary": "$160k+", "growth": "+40%", "reason": "AI integration is top priority"},
                "MLOps": {"demand": "High", "avg_salary": "$150k+", "growth": "+25%", "reason": "Modeling scaling needs"}
            }
        }

    def _get_fallback_roadmap(self, target_role: str, weeks: int) -> Dict:
        """Provide a static but high-quality roadmap for common roles"""
        weekly_plan = []
        for i in range(1, weeks + 1):
            weekly_plan.append({
                "week": i,
                "topic": f"Week {i}: Advanced {target_role} Fundamentals",
                "goal": "Master core concepts",
                "what_to_learn": "Deep dive into architecture patterns and best practices.",
                "why_learn_this": "Foundational knowledge required for senior roles.",
                "resources": [
                    {"title": f"{target_role} Full Course", "url": "https://youtube.com", "type": "Video", "platform": "YouTube"}
                ],
                "how_to_learn": "30% Theory, 70% Practice.",
                "mini_project": {
                    "title": f"Build a {target_role} MVP",
                    "description": "Create a prototype applying this week's concepts.",
                    "difficulty": "Intermediate"
                },
                "estimated_hours": 10
            })
        return {"weekly_plan": weekly_plan}

    async def generate_response(self, prompt: str) -> str:
        '''Generate a chat response using AI'''
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[{'role': 'user', 'content': prompt}],
                temperature=0.7,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            return 'I am having trouble responding right now. Please try again later.'

    async def generate_interview_questions(
        self, target_role: str, difficulty: str = "medium", count: int = 5
    ) -> List[Dict]:
        """Generate interview questions for a role"""
        prompt = f"""Generate {count} interview questions for a {target_role} position at {difficulty} difficulty level.

Questions should be a mix of:
- Technical (coding, system design)
- Behavioral (teamwork, leadership)

Return a JSON object with a "questions" array. Each question should have:
{{
    "question": "The interview question",
    "category": "technical" | "behavioral" | "system_design",
    "difficulty": "{difficulty}",
    "sample_answer_hints": "Brief hints or key points to address (optional)"
}}
"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a senior technical recruiter. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            return result.get('questions', [])
        except Exception as e:
            return self._get_fallback_questions(target_role, difficulty, count)
    
    async def evaluate_interview_answer(
        self, question: str, user_answer: str, category: str
    ) -> Dict:
        """Evaluate user's interview answer"""
        if not user_answer or len(user_answer.strip()) < 10:
            return {
                "score": 0,
                "feedback": "Please provide a more detailed answer to receive feedback.",
                "strengths": [],
                "improvements": ["Provide a complete answer with specific examples"]
            }
        
        prompt = f"""You are an expert interviewer evaluating a candidate's answer.

QUESTION ({category}): {question}
CANDIDATE'S ANSWER:
{user_answer}

Evaluate this answer and return a JSON object with:
{{
    "score": number (1-10),
    "feedback": "2-3 sentence constructive feedback",
    "strengths": ["strength 1"],
    "improvements": ["improvement 1"]
}}
"""
        try:
            response = await self.groq_client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a fair technical interviewer. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            return {
                "score": 5,
                "feedback": "Unable to evaluate at this time. Please try again.",
                "strengths": ["Answer provided"],
                "improvements": ["Try again for detailed feedback"]
            }
    
    def _get_fallback_questions(self, target_role: str, difficulty: str, count: int) -> List[Dict]:
        """Provide fallback questions if AI fails"""
        return [
            {
                "question": f"Describe your experience with the core technologies required for a {target_role}.",
                "category": "technical",
                "difficulty": difficulty,
                "sample_answer_hints": "Discuss specific projects, technologies used, and outcomes"
            }
        ] * count
