// Resume data from backend
export interface Experience {
    title: string;
    company: string;
    duration: string;
    description: string;
}

export interface Education {
    degree: string;
    institution: string;
    year: string;
}

export interface ResumeData {
    user_id: string;
    name: string;
    email: string;
    phone: string;
    skills: string[];
    education: Education[];
    experience: Experience[];
    years_of_experience: number;
}

// Skill analysis from backend
export interface TrendingSkill {
    demand: 'High' | 'Medium' | 'Low';
    avg_salary: string;
    growth: string;
    reason: string;
}

export interface SkillAnalysis {
    required_skills: string[];
    missing_skills: string[];
    matching_skills: string[];
    match_percentage: number;
    trending_skills: string[];
    job_readiness_score: number;
    trending_skills_comparison: Record<string, TrendingSkill>;
    target_role: string;
}

// Roadmap from backend
export interface Resource {
    title: string;
    url: string;
    type: 'Video' | 'Article' | 'Documentation' | 'Course';
    platform: string;
}

export interface MiniProject {
    title: string;
    description: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface WeekPlan {
    week: number;
    topic: string;
    goal: string;
    what_to_learn: string;
    why_learn_this: string;
    how_to_learn: string;
    resources: Resource[];
    mini_project: MiniProject;
    estimated_hours: number;
}

export interface Roadmap {
    weekly_plan: WeekPlan[];
    user_id: string;
    target_role: string;
    total_weeks: number;
    job_readiness_score: number;
    skills_to_learn: string[];
}
