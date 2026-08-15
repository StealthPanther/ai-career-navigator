'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { SkillAnalysis, Roadmap, WeekPlan, TrendingSkill } from '@/types';
import WeekDetailCard from './WeekDetailCard';
import {
  Trophy,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Calendar,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import ChatWidget from './ChatWidget';
import ChapterLabel from './logbook/ChapterLabel';
import Stamp from './logbook/Stamp';
import Tape from './logbook/Tape';

interface RoadmapDisplayProps {
  skillAnalysis: SkillAnalysis;
  roadmap: Roadmap;
  targetRole: string;
  userId: string;
  onReset: () => void;
}

export default function RoadmapDisplay({
  skillAnalysis,
  roadmap,
  targetRole,
  userId,
  onReset,
}: RoadmapDisplayProps) {
  const [showDetailedRoadmap, setShowDetailedRoadmap] = useState(false);

  if (showDetailedRoadmap) {
    // DETAILED ROADMAP VIEW
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <ChapterLabel index="03" title="The Roadmap" className="mb-3 max-w-sm" />
            <h2 className="font-serif text-4xl font-black tracking-tight text-ink">
              Your Learning Roadmap
            </h2>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowDetailedRoadmap(false)}
              variant="outline"
              className="h-auto border-ink/30 bg-paper-2 px-5 py-3 font-sans text-xs uppercase tracking-[0.18em] text-ink hover:bg-paper"
            >
              ← Back to Summary
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="h-auto border-ink/30 bg-paper-2 px-5 py-3 font-sans text-xs uppercase tracking-[0.18em] text-ink hover:bg-paper"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Start Over
            </Button>
          </div>
        </div>

        {/* Plan masthead */}
        <div className="relative border-2 border-ink bg-paper-2 p-6 shadow-[6px_6px_0_-3px_hsl(var(--ink))]">
          <Tape className="-top-3 left-10" angle={-4} />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-7 w-7 text-stamp" />
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">
                  {targetRole} — {roadmap.weekly_plan?.length} week plan
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                  bound & numbered · study one chapter per week
                </p>
              </div>
            </div>
            <Stamp tone="blue" flat className="hidden sm:inline-block">
              <Sparkles className="mr-1 inline h-3 w-3" />
              AI-powered
            </Stamp>
          </div>
        </div>

        {/* Week cards */}
        <div className="space-y-6">
          {roadmap.weekly_plan?.map((week: WeekPlan, idx: number) => (
            <WeekDetailCard key={idx} week={week} index={idx} />
          ))}
        </div>
      </div>
    );
  }

  // SUMMARY VIEW (Default)
  const score = skillAnalysis.job_readiness_score;
  const status =
    score >= 80 ? 'Job ready' : score >= 60 ? 'Almost there' : 'In progress';

  return (
    <div className="space-y-8">
      {/* Job readiness score */}
      <div className="relative border-2 border-ink bg-paper-2 p-8 shadow-[8px_10px_0_-4px_hsl(var(--ink))]">
        <Tape className="-top-3 left-1/2 -translate-x-1/2" angle={-2} />
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Trophy className="h-8 w-8 text-gold" />
              <h2 className="font-serif text-4xl font-black tracking-tight text-ink">
                Job Readiness Score
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-ink-2">
              for <span className="text-ink">{targetRole}</span>
            </p>
          </div>

          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 140, damping: 14 }}
              className="font-serif text-8xl font-black leading-none text-ink"
            >
              {score}
              <span className="text-3xl text-stamp">%</span>
            </motion.div>
            <div className="mt-3">
              <Stamp tone={score >= 60 ? 'red' : 'ink'} animate>
                {status}
              </Stamp>
            </div>
          </div>
        </div>

        {/* Ruled progress bar */}
        <div className="relative mt-8">
          <Progress
            value={score}
            className="h-5 rounded-none border border-ink bg-paper"
            indicatorClass="bg-ink"
          />
          {/* tick marks */}
          <div className="pointer-events-none absolute inset-0 flex justify-between px-0">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((t) => (
              <span key={t} className="h-full w-px bg-paper/60" />
            ))}
          </div>
        </div>
      </div>

      {/* Ledger + quotes */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill gap — the ledger */}
        <div className="border border-ink/15 bg-paper-2 p-7 shadow-[6px_6px_0_-3px_hsl(var(--ink))]">
          <div className="mb-6 flex items-center gap-3 border-b border-ink/15 pb-4">
            <TrendingUp className="h-6 w-6 text-stamp" />
            <h2 className="font-serif text-2xl font-bold text-ink">The Ledger</h2>
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-ink">
              <CheckCircle2 className="h-4 w-4 text-stamp" />
              You have ({skillAnalysis.matching_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillAnalysis.matching_skills.map((skill: string, idx: number) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border border-ink/25 bg-paper px-3 py-1 font-mono text-xs text-ink"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="my-6 border-t border-dashed border-ink/25" />

          <div>
            <h3 className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-stamp">
              <XCircle className="h-4 w-4" />
              To learn ({skillAnalysis.missing_skills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillAnalysis.missing_skills.map((skill: string, idx: number) => (
                <motion.span
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="border border-dashed border-stamp/50 px-3 py-1 font-mono text-xs text-stamp"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Market insights — the quotes */}
        <div className="border border-ink/15 bg-paper-2 p-7 shadow-[6px_6px_0_-3px_hsl(var(--stamp))]">
          <div className="mb-6 flex items-center gap-3 border-b border-ink/15 pb-4">
            <Sparkles className="h-6 w-6 text-seal" />
            <h2 className="font-serif text-2xl font-bold text-ink">Market Notes</h2>
          </div>

          <div className="space-y-3">
            {Object.entries(skillAnalysis.trending_skills_comparison).slice(0, 6).map(
              ([skill, stats]: [string, TrendingSkill], idx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  className="border border-ink/15 bg-paper p-4 transition-colors hover:border-stamp/50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-serif text-lg font-bold text-ink">{skill}</h4>
                    <span
                      className={`font-mono text-[9px] uppercase tracking-[0.2em] ${
                        stats.demand === 'High' ? 'text-stamp' : 'text-seal'
                      }`}
                    >
                      ● {stats.demand} demand
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2">
                    <span>Salary</span>
                    <span className="text-ink">{stats.avg_salary}</span>
                    <span className="ml-4">Growth</span>
                    <span className="text-stamp">{stats.growth}</span>
                  </div>
                  <p className="mt-2.5 border-t border-dashed border-ink/20 pt-2 font-serif text-sm italic leading-snug text-ink-2">
                    “{stats.reason}”
                  </p>
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        <Button
          onClick={() => setShowDetailedRoadmap(true)}
          className="btn-hard group h-auto bg-ink px-10 py-5 font-sans text-sm font-semibold uppercase tracking-[0.22em] text-paper-2 hover:bg-ink"
        >
          <Calendar className="mr-3 h-5 w-5 text-stamp" />
          Open the {roadmap.weekly_plan?.length}-week plan
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="h-auto border-ink/30 bg-paper-2 px-8 py-5 font-sans text-xs uppercase tracking-[0.2em] text-ink hover:bg-paper"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Start a new dossier
        </Button>
      </div>

      {/* AI Study Buddy — marginalia */}
      <ChatWidget userId={userId} />
    </div>
  );
}
