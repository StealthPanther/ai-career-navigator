'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { WeekPlan } from '@/types';
import {
    ExternalLink,
    Youtube,
    FileText,
    GraduationCap,
    BookOpen,
    Lightbulb,
    Target,
    Code,
    Clock,
    Sparkles
} from 'lucide-react';

interface WeekDetailCardProps {
    week: WeekPlan;
    index: number;
}

export default function WeekDetailCard({ week, index }: WeekDetailCardProps) {
    const getResourceIcon = (type: string) => {
        switch (type) {
            case 'Video': return <Youtube size={16} className="text-red-500" />;
            case 'Article': return <FileText size={16} className="text-blue-500" />;
            case 'Course': return <GraduationCap size={16} className="text-purple-500" />;
            case 'Documentation': return <BookOpen size={16} className="text-green-500" />;
            default: return <ExternalLink size={16} />;
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Beginner': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'Intermediate': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'Advanced': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="p-6 glass-panel border-0 hover:border-primary/20 transition-all">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/30">
                            {week.week}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-1">{week.topic}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock size={14} />
                                <span>{week.estimated_hours} hours</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Goal */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Target size={18} className="text-primary" />
                        <h4 className="font-bold text-foreground">Goal</h4>
                    </div>
                    <p className="text-muted-foreground pl-6">{week.goal}</p>
                </div>

                {/* What to Learn */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={18} className="text-blue-400" />
                        <h4 className="font-bold text-foreground">What You'll Learn</h4>
                    </div>
                    <p className="text-muted-foreground pl-6 whitespace-pre-line">{week.what_to_learn}</p>
                </div>

                {/* Why Learn This */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={18} className="text-yellow-400" />
                        <h4 className="font-bold text-foreground">Why This Matters</h4>
                    </div>
                    <p className="text-muted-foreground pl-6 italic">{week.why_learn_this}</p>
                </div>

                {/* How to Learn */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={18} className="text-purple-400" />
                        <h4 className="font-bold text-foreground">Study Tips</h4>
                    </div>
                    <p className="text-muted-foreground pl-6">{week.how_to_learn}</p>
                </div>

                {/* Resources */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ExternalLink size={18} className="text-green-400" />
                        <h4 className="font-bold text-foreground">Learning Resources</h4>
                    </div>
                    <div className="grid gap-3 pl-6">
                        {week.resources?.map((resource, idx) => (
                            <motion.a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-lg glass-panel border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all group"
                                whileHover={{ x: 4 }}
                            >
                                <div className="shrink-0">
                                    {getResourceIcon(resource.type)}
                                </div>
                                <div className="grow">
                                    <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                        {resource.title}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{resource.platform}</p>
                                </div>
                                <Badge variant="outline" className="text-xs border-white/10">
                                    {resource.type}
                                </Badge>
                                <ExternalLink size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Mini Project */}
                {week.mini_project && (
                    <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                            <Code size={18} className="text-secondary" />
                            <h4 className="font-bold text-foreground">Weekend Project</h4>
                            <Badge className={`ml-auto ${getDifficultyColor(week.mini_project.difficulty)}`}>
                                {week.mini_project.difficulty}
                            </Badge>
                        </div>
                        <div className="p-4 rounded-lg glass-panel border border-secondary/20 bg-secondary/5">
                            <h5 className="font-bold text-foreground mb-2">{week.mini_project.title}</h5>
                            <p className="text-sm text-muted-foreground">{week.mini_project.description}</p>
                        </div>
                    </div>
                )}
            </Card>
        </motion.div>
    );
}
