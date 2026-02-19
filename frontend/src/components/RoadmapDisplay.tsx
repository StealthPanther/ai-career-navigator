'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
      <div className="space-y-8 animate-fade-in-up">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold text-foreground">Your Learning Roadmap</h2>
          <div className="flex gap-4">
            <Button
              onClick={() => setShowDetailedRoadmap(false)}
              variant="outline"
              className="px-6 py-6 text-lg border-white/10 hover:bg-white/5"
            >
              ← Back to Summary
            </Button>
            <Button
              onClick={onReset}
              variant="outline"
              className="px-6 py-6 text-lg border-white/10 hover:bg-white/5"
            >
              <RotateCcw className="mr-2" size={20} />
              Start Over
            </Button>
          </div>
        </div>

        {/* Detailed Roadmap */}
        <Card className="p-6 glass-panel border-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" size={28} />
              <h3 className="text-2xl font-bold text-foreground">{targetRole} - {roadmap.weekly_plan?.length} Week Plan</h3>
            </div>
            <Badge className="py-2 px-4 text-sm font-bold bg-secondary/10 text-secondary border border-secondary/20">
              <Sparkles size={14} className="mr-2" />
              AI-Powered Roadmap
            </Badge>
          </div>

          {/* Week Cards */}
          <div className="space-y-6">
            {roadmap.weekly_plan?.map((week: WeekPlan, idx: number) => (
              <WeekDetailCard key={idx} week={week} index={idx} />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // SUMMARY VIEW (Default)
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Job Readiness Score */}
      <Card className="p-8 glass-panel border-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-primary/10 opacity-50 blur-3xl -z-10" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={36} className="text-primary drop-shadow-lg" />
                <h2 className="text-4xl font-bold tracking-tight text-foreground">Job Readiness Score</h2>
              </div>
              <p className="text-lg font-medium text-muted-foreground">For <span className="text-foreground">{targetRole}</span></p>
            </div>

            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-8xl font-mono-stat text-gradient-primary drop-shadow-2xl"
              >
                {skillAnalysis.job_readiness_score}%
              </motion.div>
              <p className="text-xl mt-2 font-bold text-foreground">
                {skillAnalysis.job_readiness_score >= 80
                  ? '🎉 Job Ready!'
                  : skillAnalysis.job_readiness_score >= 60
                    ? '🚀 Almost There'
                    : '📚 Keep Learning'}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Progress value={skillAnalysis.job_readiness_score} className="h-4 bg-secondary/20" />
          </div>
        </motion.div>
      </Card>

      {/* Skills & Market Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Skill Gap Analysis */}
        <Card className="p-6 glass-panel border-0">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-green-400" size={28} />
            <h2 className="text-2xl font-bold text-foreground">Skill Gap</h2>
          </div>

          <div className="space-y-6">
            {/* Skills You Have */}
            <div>
              <h3 className="text-lg font-bold text-green-400 mb-3 flex items-center gap-2">
                <CheckCircle2 size={20} />
                You Have ({skillAnalysis.matching_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillAnalysis.matching_skills.map((skill: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Badge className="text-xs py-1 px-3 font-medium bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10" />

            {/* Skills to Learn */}
            <div>
              <h3 className="text-lg font-bold text-orange-400 mb-3 flex items-center gap-2">
                <XCircle size={20} />
                To Learn ({skillAnalysis.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillAnalysis.missing_skills.map((skill: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Badge variant="outline" className="text-xs py-1 px-3 font-medium border-orange-500/20 text-orange-300 bg-orange-500/5 hover:bg-orange-500/10">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Market Insights */}
        <Card className="p-6 glass-panel border-0">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-secondary" size={28} />
            <h2 className="text-2xl font-bold text-foreground">Market Insights</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(skillAnalysis.trending_skills_comparison).slice(0, 6).map(
              ([skill, stats]: [string, TrendingSkill], idx) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  <div className="glass-panel border border-white/5 hover:border-primary/30 transition-all p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-sm text-foreground">
                        {skill}
                      </h4>
                      <Badge className={`text-xs font-bold border-0 ${stats.demand === 'High'
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary/20 text-secondary'
                        }`}>
                        {stats.demand}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Salary</span>
                        <span className="font-mono-stat text-green-400 font-semibold">{stats.avg_salary}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Growth</span>
                        <span className="font-mono-stat text-primary font-semibold">{stats.growth}</span>
                      </div>
                    </div>

                    <p className="mt-3 pt-3 border-t border-white/5 text-xs text-muted-foreground italic line-clamp-2">
                      &quot;{stats.reason}&quot;
                    </p>
                  </div>
                </motion.div>
              )
            )}
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-8">
        <Button
          onClick={() => setShowDetailedRoadmap(true)}
          className="px-12 py-8 text-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30"
        >
          <Calendar className="mr-3" size={24} />
          View Full {roadmap.weekly_plan?.length}-Week Roadmap
        </Button>

        <Button
          onClick={onReset}
          variant="outline"
          className="px-8 py-8 text-lg border-white/10 hover:bg-white/5 hover:text-white transition-colors"
        >
          <RotateCcw className="mr-2" size={20} />
          Create New
        </Button>
      </div>

      {/* AI Study Buddy Chat Widget */}
      <ChatWidget userId={userId} />
    </div>
  );
}
