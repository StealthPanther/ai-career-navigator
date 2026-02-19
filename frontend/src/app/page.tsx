'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ResumeData, SkillAnalysis, Roadmap } from '@/types';
import ResumeUploader from '@/components/ResumeUploader';
import SkillAnalyzer from '@/components/SkillAnalyzer';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import AnimatedBackground from '@/components/AnimatedBackground';
import FloatingIcons from '@/components/FloatingIcons';
import Floating3DCube from '@/components/Floating3DCube';
import AnimatedOrbs from '@/components/AnimatedOrbs';
import { getDashboard } from '@/lib/apiClient';

export default function Home() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string>('');
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysis | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);

  // Check if we have a user session
  useEffect(() => {
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      setUserId(storedUserId);

      // Restore session data
      getDashboard(storedUserId)
        .then((data) => {
          if (data.resume) setResumeData(data.resume);

          if (data.skill_analysis) {
            setSkillAnalysis(data.skill_analysis);
          }

          if (data.roadmap) {
            setRoadmap(data.roadmap);
            setTargetRole(data.roadmap.target_role || data.skill_analysis?.target_role || '');
          }

          // Auto-navigate based on data
          if (data.skill_analysis && data.roadmap) {
            setStep(3);
          } else if (data.resume) {
            setStep(2);
          }
        })
        .catch((err) => console.error("Failed to restore session:", err));
    }
  }, []);

  const handleResumeUpload = (data: ResumeData) => {
    setResumeData(data);
    setUserId(data.user_id);
    // Store user_id in localStorage for dashboard access
    localStorage.setItem('user_id', data.user_id);
    setStep(2);
  };

  const handleAnalysisComplete = (analysis: SkillAnalysis, roadmapData: Roadmap, role: string) => {
    setSkillAnalysis(analysis);
    setRoadmap(roadmapData);
    setTargetRole(role);
    setStep(3);
  };

  const resetFlow = () => {
    setStep(1);
    setUserId('');
    setResumeData(null);
    setTargetRole('');
    setSkillAnalysis(null);
    setRoadmap(null);
  };

  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center">
      <AnimatedBackground />
      <FloatingIcons />
      <AnimatedOrbs />

      {/* 3D Floating Cubes */}
      <Floating3DCube size={100} top="15%" left="8%" animationDuration={25} delay={0} />
      <Floating3DCube size={80} top="60%" right="10%" animationDuration={30} delay={5} />
      <Floating3DCube size={60} bottom="20%" left="15%" animationDuration={35} delay={10} />

      {/* Navigation Buttons - Top Right */}
      {userId && (
        <div className="absolute top-8 right-8 z-20">
          <a
            href="/interview"
            className="px-6 py-3 rounded-lg glass-panel border border-white/10 hover:border-primary/30 transition-all flex items-center gap-2 text-foreground hover:text-primary font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            Interview Prep
          </a>
        </div>
      )}


      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16 grow flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6 tracking-tighter">
            AI Career <span className="text-gradient-primary">Navigator</span>
          </h1>
          <div className="inline-block">
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto px-6 font-medium leading-relaxed">
              Upload your resume, choose your dream role, and get a personalized
              <span className="text-primary"> AI-powered</span> learning roadmap.
            </p>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center items-center gap-6 mb-16"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="relative flex flex-col items-center gap-2">
                <div
                  className={`
                    w-12 h-12 flex items-center justify-center font-bold text-lg rounded-full
                    transition-all duration-300 border-2
                    ${step >= i
                      ? 'bg-primary text-white border-primary shadow-[0_0_15px_rgba(249,115,22,0.5)]'
                      : 'bg-white/5 text-muted-foreground border-white/10'
                    }
                  `}
                >
                  {i}
                </div>
              </div>

              {i < 3 && (
                <div
                  className={`
                    w-12 md:w-24 h-0.5 transition-all duration-500 rounded-full
                    ${step > i
                      ? 'bg-gradient-to-r from-primary to-primary/50' // eslint-disable-line
                      : 'bg-white/10'
                    }
                  `}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl mx-auto"
            >
              <ResumeUploader onUploadComplete={handleResumeUpload} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl mx-auto"
            >
              <SkillAnalyzer
                userId={userId}
                resumeData={resumeData}
                onComplete={handleAnalysisComplete}
              />
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-7xl mx-auto"
            >
              <RoadmapDisplay
                skillAnalysis={skillAnalysis}
                roadmap={roadmap}
                targetRole={targetRole}
                userId={userId}
                onReset={resetFlow}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
