'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { analyzeSkills, generateRoadmap } from '@/lib/apiClient';
import type { ResumeData, SkillAnalysis, Roadmap } from '@/types';

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
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="text-center space-y-4 mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-gradient-primary">Analysis and</span>
            <br />
            <span className="text-foreground">Recommendations</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Monitor your profile performance using AI metrics like skill gaps, market trends, and role fitment.
            Receive tailored tips to improve your career based on data analysis.
          </p>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Current Skills Display - Left Column */}
        <div className="md:col-span-12 lg:col-span-8">
          <Card className="p-8 h-full glass-panel border-0 relative overflow-hidden group">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10 group-hover:bg-primary/10 transition-all duration-700" />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Your DNA</h2>
                  <p className="text-sm text-muted-foreground">Detected skills from resume</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {resumeData?.skills?.map((skill: string, idx: number) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Badge className="
                            bg-secondary/10 text-secondary hover:bg-secondary/20 
                            border border-secondary/20 px-4 py-2 text-sm 
                            transition-all duration-300 hover:scale-105
                        ">
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Card>
        </div>

        {/* Action / Stat Card - Right Column (Placeholder for stats, currently just visual balance) */}
        <div className="md:col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 glass-panel border-0 relative overflow-hidden group h-full flex flex-col justify-center items-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Target className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Target Precise Roles</h3>
            <p className="text-muted-foreground text-sm">
              Select a target role below to generate a personalized gap analysis and learning roadmap.
            </p>
          </Card>
        </div>
      </div>

      {/* Target Role Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-bold text-foreground">Choose Target Role</h2>
          <span className="text-sm text-muted-foreground">Select one to proceed</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {TARGET_ROLES.map((role) => (
            <motion.button
              key={role}
              whileHover={{ scale: 1.02, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role)}
              className={`
                p-4 rounded-xl border text-left flex flex-col justify-between h-32 transition-all duration-300 group
                ${selectedRole === role
                  ? 'glass-panel border-primary/50 ring-2 ring-primary/20 bg-primary/5'
                  : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/5'
                }
                `}
            >
              <div className={`p-2 rounded-lg w-fit ${selectedRole === role ? 'bg-primary text-white' : 'bg-white/5 text-muted-foreground group-hover:text-foreground'}`}>
                <TrendingUp size={20} />
              </div>
              <div className="w-full">
                <p className={`font-medium ${selectedRole === role ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                  {role}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-8"
      >
        <Button
          onClick={handleAnalyze}
          disabled={!selectedRole || loading}
          className="
            relative overflow-hidden
            px-12 py-8 text-lg font-semibold rounded-2xl
            bg-linear-to-r from-orange-500 to-rose-600 
            hover:from-orange-600 hover:to-rose-700
            disabled:opacity-50 disabled:cursor-not-allowed
            shadow-xl hover:shadow-2xl shadow-orange-500/20
            transition-all duration-300 transform hover:-translate-y-1
            group
          "
        >
          <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 -skew-x-12 -translate-x-full" />

          {loading ? (
            <span className="flex items-center gap-3 relative z-10">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Generating Roadmap...
            </span>
          ) : (
            <span className="flex items-center gap-3 relative z-10 text-white">
              Start Analysis
              <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
        {error && (
          <p className="text-red-500 text-center mt-4 font-medium absolute -bottom-12">{error}</p>
        )}
      </motion.div>
    </div>
  );
}
