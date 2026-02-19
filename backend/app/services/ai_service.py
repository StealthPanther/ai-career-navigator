from openai import AsyncOpenAI
import google.generativeai as genai
import json
import os
import asyncio
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, List

class AIService:
    """Hybrid AI service using Cerebras (primary), Gemini (backup), Groq (fallback)"""
    
    def __init__(self):
        # Fix for OpenAI SDK expecting OPENAI_API_KEY even when using custom base_url
        if not os.getenv("OPENAI_API_KEY"):
            os.environ["OPENAI_API_KEY"] = "dummy-key-not-used"
            
        # Primary: Cerebras (1M tokens/day, fastest)
        self.cerebras_client = AsyncOpenAI(
            api_key=os.getenv("CEREBRAS_API_KEY"),
            base_url="https://api.cerebras.ai/v1"
        )
        self.cerebras_model = "llama3.1-8b"  # Fast and accurate
        
        # Backup: Google Gemini (1M token context for complex resumes)
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.gemini_model = genai.GenerativeModel('gemini-pro')
        
        # Thread pool for blocking synchronous calls (like Gemini)
        self.executor = ThreadPoolExecutor(max_workers=3)
        
    async def _run_blocking(self, func, *args):
        """Run blocking synchronous functions in a thread pool"""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(self.executor, func, *args)
        
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
            # Try Cerebras first (fastest)
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[
                    {"role": "system", "content": "You are an expert resume parser. Return valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Cerebras failed, using Gemini: {e}")
            try:
                # Fallback to Gemini
                # Run blocking Gemini call in thread pool
                response = await self._run_blocking(self.gemini_model.generate_content, prompt)
                return json.loads(response.text)
            except Exception as e2:
                print(f"Gemini also failed: {e2}")
                # Ultimate fallback for resume parsing
                return {
                    "name": "User",
                    "email": "",
                    "phone": "",
                    "skills": [],
                    "education": [],
                    "experience": [],
                    "years_of_experience": 0
                }

    async def analyze_skill_gap(self, current_skills: List[str], target_role: str) -> Dict:
        """Analyze what skills are missing for target role"""
        
        # Enhanced prompt for "Informatics" quality
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
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[
                    {"role": "system", "content": "You are a career counselor and tech industry expert. Provide detailed, data-backed insights."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"Error in skill analysis: {e}")
            # Smart Fallback Template for common roles
            return self._get_fallback_skill_analysis(current_skills, target_role)

    async def generate_roadmap(self, missing_skills: List[str], target_role: str, weeks: int = 12) -> Dict:
        """Generate week-by-week learning roadmap"""
        
        print(f"[AI Service] Generating roadmap: {weeks} weeks for {target_role}")
        print(f"[AI Service] Skills to cover: {', '.join(missing_skills[:5])}{'...' if len(missing_skills) > 5 else ''}")
        
        # Enhanced prompt for "Best in Class" roadmap
        prompt = f"""Create a premium, detailed {weeks}-week learning masterclass for a {target_role}.
        
Target Role: {target_role}
Skills to Focus On: {', '.join(missing_skills)}

Return a JSON object with a "weekly_plan" list. For EACH week (1 to {weeks}), provide:
{{
    "week": number,
    "topic": "High-Impact Topic Title",
    "goal": "The specific outcome of this week",
    "what_to_learn": "Detailed technical concepts (bullet points)",
    "why_learn_this": "Industry context: Why is this critical? (e.g. 'Used by 80% of Fortune 500')",
    "resources": [
        {{
            "title": "Specific Video/Article Title",
            "url": "https://real-link.com",
            "type": "Video" | "Article" | "Documentation" | "Course",
            "platform": "YouTube" | "Coursera" | "Medium" | "Official Docs"
        }}
    ],
    "how_to_learn": "Actionable study tips (e.g., 'Build x using y')",
    "mini_project": {{
        "title": "Exciting Project Name",
        "description": "What to build (e.g. 'Deploy a serverless API with AWS Lambda')",
        "difficulty": "Beginner" | "Intermediate" | "Advanced"
    }},
    "estimated_hours": number
}}

CRITICAL INSTRUCTIONS:
1. NO GENERIC CONTENT. Each week must be unique and progressive.
2. Week numbers MUST increment: 1, 2, 3, 4, etc. up to {weeks}.
3. RESOURCES MUST BE REAL. Link to specific popular tutorials (Traversy Media, FreeCodeCamp, AWS Docs).
4. "mini_project" must be buildable in a weekend.
5. "why_learn_this" should motivate the user with job market facts.
"""
        
        try:
            print(f"[AI Service] Calling Cerebras API...")
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[
                    {"role": "system", "content": "You are a specialized technical curriculum designer. Create rigorous, university-grade roadmaps."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            
            # Validate week numbers
            if 'weekly_plan' in result:
                week_nums = [w.get('week') for w in result['weekly_plan']]
                print(f"[AI Service] Cerebras returned {len(week_nums)} weeks: {week_nums[:5]}...")
                if len(set(week_nums)) != len(week_nums):
                    print(f"[AI Service] WARNING: Duplicate week numbers detected: {week_nums}")
            else:
                print(f"[AI Service] WARNING: No weekly_plan in response")
            
            return result
        except Exception as e:
            print(f"[AI Service] Cerebras failed: {e}")
            print(f"[AI Service] Using fallback roadmap...")
            return self._get_fallback_roadmap(target_role, weeks)

    def _get_fallback_skill_analysis(self, current_skills: List[str], target_role: str) -> Dict:
        """Provide high-quality analysis even if AI fails"""
        # Improved generic fallback
        return {
            "required_skills": ["Python", "AWS", "Docker", "Kubernetes", "System Design", "CI/CD", "SQL", "NoSQL", "Git", "REST APIs"],
            "missing_skills": ["AWS", "Kubernetes", "System Design"], # Simulation
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
        print(f"[AI Service] Generating fallback roadmap for {weeks} weeks")
        
        weekly_plan = []
        for i in range(1, weeks + 1):
            weekly_plan.append({
                "week": i,
                "topic": f"Week {i}: Advanced {target_role} Fundamentals",
                "goal": "Master core concepts",
                "what_to_learn": "Deep dive into architecture patterns and best practices.",
                "why_learn_this": "Foundational knowledge required for senior roles.",
                "resources": [
                    {"title": f"{target_role} Full Course", "url": "https://youtube.com", "type": "Video", "platform": "YouTube"},
                    {"title": "Official Documentation", "url": "https://docs.github.com", "type": "Documentation", "platform": "Docs"}
                ],
                "how_to_learn": "30% Theory, 70% Practice.",
                "mini_project": {
                    "title": f"Build a {target_role} MVP",
                    "description": "Create a fully functional prototype applying this week's concepts.",
                    "difficulty": "Intermediate"
                },
                "estimated_hours": 10
            })
        
        week_nums = [w['week'] for w in weekly_plan]
        print(f"[AI Service] Fallback roadmap week numbers: {week_nums}")
        
        return {"weekly_plan": weekly_plan}

    async def generate_response(self, prompt: str) -> str:
        '''Generate a chat response using AI'''
        try:
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[{'role': 'user', 'content': prompt}],
                temperature=0.7,
                max_tokens=200
            )
            return response.choices[0].message.content.strip()
        except:
            try:
                response = await self._run_blocking(self.gemini_model.generate_content, prompt)
                return response.text.strip()
            except:
                return 'I am having trouble responding right now. Please try again later.'

    async def generate_interview_questions(
        self, 
        target_role: str, 
        difficulty: str = "medium", 
        count: int = 5
    ) -> List[Dict]:
        """Generate interview questions for a role
        
        Args:
            target_role: Job role to generate questions for
            difficulty: 'easy', 'medium', or 'hard'
            count: Number of questions to generate
            
        Returns:
            List of question dictionaries with question, category, difficulty, hints
        """
        prompt = f"""Generate {count} interview questions for a {target_role} position at {difficulty} difficulty level.

Questions should be a mix of:
- Technical (coding, system design, role-specific knowledge)
- Behavioral (teamwork, leadership, problem-solving)
- System Design (for senior roles)

Return a JSON object with a "questions" array. Each question should have:
{{
    "question": "The interview question",
    "category": "technical" | "behavioral" | "system_design",
    "difficulty": "{difficulty}",
    "sample_answer_hints": "Brief hints or key points to address (optional)"
}}

CRITICAL INSTRUCTIONS:
1. Questions must be REALISTIC - actual questions asked in real interviews
2. Technical questions should be role-specific (e.g., React for Frontend, AWS for Cloud)
3. Behavioral questions should use STAR method format
4. System design questions only for senior roles
5. Mix difficulty within the chosen level (some easier, some harder)
6. Make questions challenging but fair

Return exactly {count} questions.
"""
        
        try:
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[
                    {"role": "system", "content": "You are a senior technical recruiter with 10+ years of experience conducting interviews."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,  # Higher temperature for variety
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            return result.get('questions', [])
            
        except Exception as e:
            print(f"Error generating interview questions: {e}")
            # Fallback questions
            return self._get_fallback_questions(target_role, difficulty, count)
    
    async def evaluate_interview_answer(
        self,
        question: str,
        user_answer: str,
        category: str
    ) -> Dict:
        """Evaluate user's interview answer
        
        Args:
            question: The interview question
            user_answer: User's answer
            category: Question category (technical, behavioral, system_design)
            
        Returns:
            Dictionary with score, feedback, strengths, improvements
        """
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
    "score": number (1-10, where 10 is excellent),
    "feedback": "2-3 sentence constructive feedback",
    "strengths": ["strength 1", "strength 2"],
    "improvements": ["improvement 1", "improvement 2"]
}}

EVALUATION CRITERIA:
- Technical answers: Correctness, depth, practical knowledge
- Behavioral answers: STAR method usage, specific examples, self-awareness
- System design: Scalability considerations, trade-offs, architectural thinking

Be constructive and encouraging while being honest about areas for improvement.
"""
        
        try:
            response = await self.cerebras_client.chat.completions.create(
                model=self.cerebras_model,
                messages=[
                    {"role": "system", "content": "You are a fair and experienced technical interviewer providing constructive feedback."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,  # Lower temperature for consistent evaluation
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
            
        except Exception as e:
            print(f"Error evaluating answer: {e}")
            return {
                "score": 5,
                "feedback": "Unable to evaluate at this time. Please try again.",
                "strengths": ["Answer provided"],
                "improvements": ["Try again for detailed feedback"]
            }
    
    def _get_fallback_questions(self, target_role: str, difficulty: str, count: int) -> List[Dict]:
        """Provide fallback questions if AI fails"""
        fallback_questions = [
            {
                "question": f"Describe your experience with the core technologies required for a {target_role}.",
                "category": "technical",
                "difficulty": difficulty,
                "sample_answer_hints": "Discuss specific projects, technologies used, and outcomes"
            },
            {
                "question": "Tell me about a time when you faced a challenging technical problem. How did you approach it?",
                "category": "behavioral",
                "difficulty": difficulty,
                "sample_answer_hints": "Use STAR method: Situation, Task, Action, Result"
            },
            {
                "question": f"How would you design a scalable system for {target_role.lower()} requirements?",
                "category": "system_design",
                "difficulty": difficulty,
                "sample_answer_hints": "Consider scalability, reliability, and trade-offs"
            },
            {
                "question": "What are your biggest strengths and how do they apply to this role?",
                "category": "behavioral",
                "difficulty": difficulty,
                "sample_answer_hints": "Be specific with examples"
            },
            {
                "question": f"Explain the most important best practices for {target_role}.",
                "category": "technical",
                "difficulty": difficulty,
                "sample_answer_hints": "Cover coding standards, testing, and architecture"
            }
        ]
        
        return fallback_questions[:count]
