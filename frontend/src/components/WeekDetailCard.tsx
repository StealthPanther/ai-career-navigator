'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
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
import Stamp from './logbook/Stamp';
import Tape from './logbook/Tape';

interface WeekDetailCardProps {
    week: WeekPlan;
    index: number;
}

const resourceMeta: Record<string, { icon: React.ReactNode; tone: string }> = {
    Video: { icon: <Youtube className="h-4 w-4 text-stamp" />, tone: 'text-stamp' },
    Article: { icon: <FileText className="h-4 w-4 text-seal" />, tone: 'text-seal' },
    Course: { icon: <GraduationCap className="h-4 w-4 text-plum" />, tone: 'text-plum' },
    Documentation: { icon: <BookOpen className="h-4 w-4 text-gold" />, tone: 'text-gold' },
};

export default function WeekDetailCard({ week, index }: WeekDetailCardProps) {
    const difficultyTone: Record<string, string> = {
        Beginner: 'text-ink',
        Intermediate: 'text-seal',
        Advanced: 'text-stamp',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.06, 0.5) }}
            className="relative border border-ink/15 bg-paper-2 shadow-[6px_6px_0_-3px_hsl(var(--ink))]"
        >
            <Tape className="-top-3 right-12" angle={4} />

            {/* Header — week plate */}
            <div className="flex flex-wrap items-center gap-5 border-b-2 border-ink px-6 py-5 sm:px-8">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-ink bg-paper font-serif text-3xl font-black text-stamp shadow-[3px_3px_0_0_hsl(var(--ink))]">
                    {String(week.week).padStart(2, '0')}
                </div>
                <div className="grow">
                    <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">
                        chapter {String(week.week).padStart(2, '0')} · {week.estimated_hours} hours
                    </p>
                    <h3 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
                        {week.topic}
                    </h3>
                </div>
                <div className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-2 md:flex">
                    <Clock className="h-4 w-4 text-stamp" />
                    est. {week.estimated_hours} hrs
                </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-8 md:grid-cols-2">
                {/* Left column */}
                <div className="space-y-6">
                    <div>
                        <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-stamp">
                            <Target className="h-3.5 w-3.5" /> Goal
                        </p>
                        <p className="text-ink-2">{week.goal}</p>
                    </div>
                    <div>
                        <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-seal">
                            <BookOpen className="h-3.5 w-3.5" /> What you&apos;ll learn
                        </p>
                        <p className="whitespace-pre-line text-ink-2">{week.what_to_learn}</p>
                    </div>
                    <div>
                        <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-gold">
                            <Lightbulb className="h-3.5 w-3.5" /> Why this matters
                        </p>
                        <p className="font-serif italic text-ink-2">{week.why_learn_this}</p>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <div>
                        <p className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-plum">
                            <Sparkles className="h-3.5 w-3.5" /> Study tips
                        </p>
                        <p className="text-ink-2">{week.how_to_learn}</p>
                    </div>
                    <div>
                        <p className="mb-2.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink">
                            <ExternalLink className="h-3.5 w-3.5" /> Learning resources
                        </p>
                        <div className="space-y-2">
                            {week.resources?.map((resource, idx) => {
                                const meta = resourceMeta[resource.type] || {
                                    icon: <ExternalLink className="h-4 w-4 text-ink" />,
                                    tone: 'text-ink',
                                };
                                return (
                                    <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center gap-3 border border-ink/15 bg-paper px-3.5 py-2.5 transition-all hover:border-stamp/60 hover:shadow-[3px_3px_0_0_hsl(var(--stamp)/0.4)]"
                                    >
                                        <span className={`shrink-0 ${meta.tone}`}>{meta.icon}</span>
                                        <span className="grow">
                                            <span className="block text-sm font-medium text-ink group-hover:text-stamp">
                                                {resource.title}
                                            </span>
                                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2">
                                                {resource.platform}
                                            </span>
                                        </span>
                                        <Badge
                                            variant="outline"
                                            className="rounded-none border-ink/25 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-2"
                                        >
                                            {resource.type}
                                        </Badge>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Weekend project */}
            {week.mini_project && (
                <div className="border-t-2 border-dashed border-ink/25 px-6 py-5 sm:px-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-stamp">
                            <Code className="h-3.5 w-3.5" /> Weekend project
                        </p>
                        <Stamp
                            tone={week.mini_project.difficulty === 'Beginner' ? 'ink' : week.mini_project.difficulty === 'Intermediate' ? 'blue' : 'red'}
                            flat
                            className="text-[9px]!"
                        >
                            {week.mini_project.difficulty}
                        </Stamp>
                    </div>
                    <div className="mt-3 border border-ink/20 bg-paper p-4">
                        <h5 className="font-serif text-lg font-bold text-ink">
                            {week.mini_project.title}
                        </h5>
                        <p className="mt-1 text-sm text-ink-2">{week.mini_project.description}</p>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
