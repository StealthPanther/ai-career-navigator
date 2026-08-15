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
import Cursor from '@/components/logbook/Cursor';
import Stamp from '@/components/logbook/Stamp';
import { getDashboard } from '@/lib/apiClient';
import { GraduationCap, ArrowUpRight, Check } from 'lucide-react';
import Link from 'next/link';

const chapters = [
  { n: '01', label: 'Receipt' },
  { n: '02', label: 'Analysis' },
  { n: '03', label: 'Roadmap' },
];

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
    if (!storedUserId) return;

    // Defer the synchronous state update out of the effect body.
    const raf = requestAnimationFrame(() => setUserId(storedUserId));

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

    return () => cancelAnimationFrame(raf);
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
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-paper font-sans text-ink selection:bg-stamp selection:text-paper-2">
      <AnimatedBackground />
      <FloatingIcons />
      <AnimatedOrbs />
      <Cursor />

      {/* Wireframe cubes (kept, inked) */}
      <Floating3DCube size={100} top="14%" left="7%" animationDuration={28} delay={0} />
      <Floating3DCube size={80} top="62%" right="9%" animationDuration={32} delay={5} />
      <Floating3DCube size={60} bottom="18%" left="14%" animationDuration={36} delay={10} />

      {/* Masthead row */}
      <header className="relative z-20 w-full border-b border-ink/15 bg-paper/80 backdrop-blur-md">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center bg-ink font-serif text-sm font-black text-paper-2 shadow-hard-sm">
              ACN
            </span>
            <span className="leading-tight">
              <span className="block font-serif text-lg font-bold tracking-tight text-ink">
                The Dossier
              </span>
              <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-ink-2">
                ch. 01–03 · your file
              </span>
            </span>
          </Link>

          {userId ? (
            <a
              href="/interview"
              data-cursor="examine"
              className="btn-hard inline-flex items-center gap-2 bg-seal px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-2"
            >
              <GraduationCap className="h-4 w-4" />
              The Examination
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              href="/"
              className="inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-2 transition-colors hover:border-stamp hover:text-stamp"
            >
              Back to the logbook
            </Link>
          )}
        </div>
      </header>

      <div className="relative z-10 container mx-auto flex grow flex-col px-4 py-10 md:py-14">
        {/* Title block */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-stamp">
            the career logbook · your personal file
          </p>
          <h1 className="font-serif text-5xl font-black tracking-tight text-ink md:text-7xl">
            Build the <span className="text-stamp">dossier.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">
            Upload your résumé, choose your dream role, and the press prints you
            a personalized, week-by-week learning roadmap.
          </p>
        </motion.div>

        {/* Chapter progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-14 flex items-center justify-center"
        >
          {chapters.map((c, i) => (
            <div key={c.n} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex h-12 w-12 items-center justify-center border-2 font-mono text-sm font-bold transition-all duration-300 ${
                    step >= i + 1
                      ? 'border-ink bg-ink text-paper-2 shadow-[3px_3px_0_0_hsl(var(--stamp))]'
                      : 'border-ink/25 bg-paper-2 text-ink-2'
                  }`}
                >
                  {step > i + 1 ? <Check className="h-5 w-5" /> : c.n}
                </div>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                    step >= i + 1 ? 'text-ink' : 'text-ink-2'
                  }`}
                >
                  {c.label}
                </span>
              </div>
              {i < chapters.length - 1 && (
                <div
                  className={`mx-3 mb-6 h-0.5 w-10 transition-all duration-500 md:w-20 ${
                    step > i + 1 ? 'bg-stamp' : 'bg-ink/15'
                  }`}
                />
              )}
            </div>
          ))}
        </motion.div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-full max-w-3xl"
            >
              <ResumeUploader onUploadComplete={handleResumeUpload} />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-full max-w-6xl"
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
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-full max-w-7xl"
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

        {/* Page number */}
        <div className="mt-16 flex justify-center">
          <Stamp tone="ink" flat>
            p. {String(step).padStart(2, '0')} — filed
          </Stamp>
        </div>
      </div>
    </main>
  );
}
