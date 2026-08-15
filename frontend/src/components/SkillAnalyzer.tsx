'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles, ChevronRight, Feather } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { analyzeSkills, generateRoadmap } from '@/lib/apiClient';
import type { ResumeData, SkillAnalysis, Roadmap } from '@/types';
import ChapterLabel from './logbook/ChapterLabel';
import Stamp from './logbook/Stamp';

interface SkillAnalyzerProps {
  userId: string;
  resumeData: ResumeData | null;
  onComplete: (analysis: SkillAnalysis, roadmap: Roadmap, role: string) => void;
}

const TARGET_ROLES = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Architect',
  'Mobile Developer',
  'AI Engineer',
];

export default function SkillAnalyzer({ userId, resumeData, onComplete }: SkillAnalyzerProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!selectedRole) return;

    setLoading(true);
    setError(null);
    try {
      const analysis = await analyzeSkills(userId, selectedRole);
      const roadmapData = await generateRoadmap(userId, selectedRole, 12);
      onComplete(analysis, roadmapData, selectedRole);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to analyze skills. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <ChapterLabel index="02" title="The Analysis" className="mx-auto mb-6 max-w-md" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-serif text-4xl font-black tracking-tight text-ink md:text-6xl">
            Measure the <span className="text-stamp">gap.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">
            Your profile is collated against live market data — skill gaps,
            demand, and fitment — then the press typesets your reading.
          </p>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Current skills — left */}
        <div className="md:col-span-12 lg:col-span-8">
          <div className="relative h-full border border-ink/15 bg-paper-2 p-7 shadow-[6px_6px_0_-3px_hsl(var(--ink))]">
            <div className="mb-6 flex items-center gap-3 border-b border-ink/15 pb-5">
              <span className="flex h-10 w-10 items-center justify-center border-2 border-ink bg-paper text-stamp">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink">Your Profile</h2>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                  detected from résumé · p. 1
                </p>
              </div>
            </div>

            {resumeData?.skills?.length ? (
              <div className="flex flex-wrap gap-2.5">
                {resumeData.skills.map((skill: string, idx: number) => (
                  <motion.span
                    key={idx}
                    initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                    animate={{ opacity: 1, scale: 1, rotate: (idx % 3) - 1 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border border-ink/25 bg-paper px-3.5 py-1.5 font-mono text-xs tracking-wide text-ink shadow-[2px_2px_0_0_hsl(var(--ink)/0.5)]"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-ink-2">No skills detected yet.</p>
            )}
          </div>
        </div>

        {/* Right note card */}
        <div className="md:col-span-12 lg:col-span-4">
          <div className="relative flex h-full flex-col items-center justify-center border border-ink/15 bg-paper-2 p-7 text-center shadow-[6px_6px_0_-3px_hsl(var(--stamp))]">
            <Feather className="mb-4 h-9 w-9 text-stamp" strokeWidth={1.5} />
            <h3 className="font-serif text-xl font-bold text-ink">The Target</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              Pick the role you&apos;re marching toward. The press will print your
              gap analysis and roadmap on the next pages.
            </p>
            <div className="mt-5 h-1 w-12 bg-stamp" />
          </div>
        </div>
      </div>

      {/* Role picker */}
      <div>
        <div className="mb-5 flex items-baseline justify-between border-b border-ink/15 pb-3">
          <h2 className="font-serif text-2xl font-bold text-ink">Choose target role</h2>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
            select one to proceed
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {TARGET_ROLES.map((role, i) => {
            const selected = selectedRole === role;
            return (
              <motion.button
                key={role}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role)}
                className={`group relative flex h-32 flex-col justify-between border p-4 text-left transition-all duration-300 ${
                  selected
                    ? 'border-2 border-ink bg-paper-2 shadow-[4px_4px_0_0_hsl(var(--stamp))]'
                    : 'border border-ink/20 bg-paper-2/60 hover:border-ink/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`flex h-8 w-8 items-center justify-center border font-mono text-xs ${
                      selected ? 'border-ink bg-ink text-paper-2' : 'border-ink/30 text-ink-2'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {selected && <Stamp tone="red" className="text-[9px]!">Selected</Stamp>}
                </div>
                <p className={`font-serif text-lg font-bold leading-tight ${selected ? 'text-ink' : 'text-ink-2 group-hover:text-ink'}`}>
                  {role}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center pt-6">
        <Button
          onClick={handleAnalyze}
          disabled={!selectedRole || loading}
          className="btn-hard group relative h-auto overflow-visible bg-ink px-14 py-5 font-sans text-sm font-semibold uppercase tracking-[0.22em] text-paper-2 hover:bg-ink disabled:opacity-50"
        >
          {loading ? (
            <span className="flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper-2/30 border-t-paper-2" />
              Setting the press…
            </span>
          ) : (
            <span className="flex items-center gap-3">
              Run the analysis
              <ChevronRight className="transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
        {error && (
          <p className="mt-4 border border-stamp/40 bg-stamp/10 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-stamp">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
