'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Award, ArrowLeft } from 'lucide-react';
import { generateInterview, submitInterview } from '@/lib/apiClient';
import Cursor from '@/components/logbook/Cursor';
import ChapterLabel from '@/components/logbook/ChapterLabel';
import Stamp from '@/components/logbook/Stamp';
import Tape from '@/components/logbook/Tape';

interface InterviewQuestion {
    question: string;
    category: string;
    difficulty: string;
    sample_answer_hints?: string;
}

interface QuestionWithAnswer extends InterviewQuestion {
    user_answer: string;
    ai_feedback?: string;
    score?: number;
    strengths?: string[];
    improvements?: string[];
}

interface InterviewResult {
    session_id: string;
    questions: QuestionWithAnswer[];
    overall_score: number;
    total_questions: number;
}

export default function InterviewPage() {
    const [stage, setStage] = useState<'setup' | 'practice' | 'results'>('setup');
    const [difficulty, setDifficulty] = useState('medium');
    const [questionCount, setQuestionCount] = useState(5);
    const [targetRole, setTargetRole] = useState('');
    const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [sessionId, setSessionId] = useState('');
    const [results, setResults] = useState<InterviewResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');

    // Load userId from localStorage
    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const startInterview = async () => {
        if (!userId) {
            alert('Please upload your resume first!');
            return;
        }

        if (!targetRole.trim()) {
            alert('Please enter a target role!');
            return;
        }

        setLoading(true);

        try {
            const data = await generateInterview(userId, targetRole, difficulty, questionCount);
            console.log('API Response:', data);

            // Validate response structure
            if (!data.questions || !Array.isArray(data.questions)) {
                console.error('Invalid response structure:', data);
                throw new Error('Invalid response from server. Please try again.');
            }

            if (data.questions.length === 0) {
                throw new Error('No questions were generated. Please try again.');
            }

            setQuestions(data.questions);
            setSessionId(data.session_id);
            setAnswers(new Array(data.questions.length).fill(''));
            setStage('practice');
        } catch (error) {
            console.error('Error generating interview:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to generate interview questions. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const submitAnswers = async () => {
        setLoading(true);

        try {
            const submission = questions.map((q, idx) => ({
                question: q.question,
                answer: answers[idx] || '',
                category: q.category
            }));

            const data = await submitInterview(sessionId, submission);
            setResults(data);
            setStage('results');
        } catch (error) {
            console.error('Error submitting answers:', error);
            alert('Failed to evaluate answers. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCategoryTone = (category: string) => {
        const colors: Record<string, string> = {
            technical: 'text-seal border-seal/60',
            behavioral: 'text-ink border-ink/60',
            system_design: 'text-plum border-plum/60'
        };
        return colors[category] || 'text-ink-2 border-ink/40';
    };

    const getDifficultyTone = (diff: string) => {
        const colors: Record<string, string> = {
            easy: 'text-ink',
            medium: 'text-seal',
            hard: 'text-stamp'
        };
        return colors[diff] || 'text-ink-2';
    };

    const pageShell = (children: React.ReactNode, title: string, sub: string) => (
        <main className="relative min-h-screen bg-paper font-sans text-ink selection:bg-stamp selection:text-paper-2">
            <Cursor />
            {/* ink washes */}
            <div className="pointer-events-none fixed -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-seal/10 blur-3xl" />
            <div className="pointer-events-none fixed -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-stamp/10 blur-3xl" />

            {/* Back button */}
            <div className="fixed left-6 top-6 z-20">
                <a
                    href="/dashboard"
                    className="btn-hard inline-flex items-center gap-2 bg-paper-2 px-4 py-2.5 border-2 border-ink font-mono text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:text-stamp"
                >
                    <ArrowLeft className="h-4 w-4" />
                    The Dossier
                </a>
            </div>

            <div className="container relative mx-auto max-w-3xl px-4 py-20">
                <div className="mb-10">
                    <ChapterLabel index="04" title="The Examination" className="mb-5 max-w-sm" />
                    <h1 className="font-serif text-4xl font-black tracking-tight text-ink md:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-3 text-lg text-ink-2">{sub}</p>
                </div>
                {children}
            </div>
        </main>
    );

    // ── SETUP ──
    if (stage === 'setup') {
        return pageShell(
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="relative border-2 border-ink bg-paper-2 shadow-[8px_10px_0_-4px_hsl(var(--ink))]">
                    <Tape className="-top-3 left-10" angle={-4} />
                    <div className="border-b-2 border-ink px-7 py-4">
                        <div className="flex items-center justify-between">
                            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-2">
                                examination paper · form A
                            </p>
                            <Stamp tone="red" className="hidden sm:inline-block">Private &amp; confidential</Stamp>
                        </div>
                    </div>

                    <div className="space-y-8 px-7 py-8">
                        {/* Target role */}
                        <div>
                            <label className="mb-2 block font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
                                Examinee — target role
                            </label>
                            <input
                                type="text"
                                value={targetRole}
                                onChange={(e) => setTargetRole(e.target.value)}
                                placeholder="e.g., Full Stack Developer"
                                className="w-full border-2 border-ink/25 bg-paper px-4 py-3.5 text-ink placeholder:text-ink-2/60 focus:border-stamp focus:outline-none"
                            />
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label className="mb-3 block font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
                                Difficulty
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {['easy', 'medium', 'hard'].map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setDifficulty(diff)}
                                        className={`border-2 px-4 py-3.5 font-mono text-xs uppercase tracking-[0.22em] transition-all duration-300 ${
                                            difficulty === diff
                                                ? 'border-ink bg-ink text-paper-2 shadow-[4px_4px_0_0_hsl(var(--stamp))]'
                                                : 'border-ink/25 bg-paper text-ink-2 hover:border-ink/60 hover:text-ink'
                                        }`}
                                    >
                                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Question count */}
                        <div>
                            <div className="mb-3 flex items-baseline justify-between">
                                <label className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
                                    Number of questions
                                </label>
                                <span className="font-serif text-4xl font-black leading-none text-stamp">
                                    {questionCount}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="10"
                                value={questionCount}
                                onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                className="w-full accent-[hsl(var(--stamp))]"
                            />
                            <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-ink-2">
                                <span>3</span><span>10</span>
                            </div>
                        </div>

                        <Button
                            onClick={startInterview}
                            disabled={loading || !targetRole.trim()}
                            className="btn-hard group h-auto w-full bg-ink px-6 py-5 font-sans text-sm font-semibold uppercase tracking-[0.26em] text-paper-2 hover:bg-ink disabled:opacity-50"
                        >
                            {loading ? 'Setting the paper…' : 'Begin examination'}
                            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>

                <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                    open book · open notes · the buddy stays in the margin
                </p>
            </motion.div>,
            'Sit for the exam.',
            'Three degrees of difficulty, up to ten questions, examiner\'s remarks on every answer.'
        );
    }

    // ── PRACTICE ──
    if (stage === 'practice') {
        const currentQuestion = questions[currentIndex];
        const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

        return pageShell(
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* Progress rule */}
                <div className="mb-8">
                    <div className="mb-2 flex items-baseline justify-between">
                        <p className="font-serif text-xl font-bold text-ink">
                            Question {currentIndex + 1} of {questions.length}
                        </p>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stamp">
                            {progress}% complete
                        </p>
                    </div>
                    <div className="relative h-3 border border-ink bg-paper">
                        <div className="h-full bg-ink transition-all duration-500" style={{ width: `${progress}%` }} />
                        {[25, 50, 75].map((t) => (
                            <span key={t} className="absolute inset-y-0 w-px bg-paper" style={{ left: `${t}%` }} />
                        ))}
                    </div>
                </div>

                <div className="relative border-2 border-ink bg-paper-2 shadow-[8px_10px_0_-4px_hsl(var(--stamp))]">
                    <Tape className="-top-3 right-12" angle={4} />

                    <div className="border-b-2 border-ink px-7 py-4">
                        <div className="flex flex-wrap gap-3">
                            <Stamp tone="ink" flat className="text-[9px]!">
                                {currentQuestion.category.replace('_', ' ')}
                            </Stamp>
                            <Stamp
                                tone={currentQuestion.difficulty === 'easy' ? 'ink' : currentQuestion.difficulty === 'medium' ? 'blue' : 'red'}
                                flat
                                className="text-[9px]!"
                            >
                                {currentQuestion.difficulty}
                            </Stamp>
                        </div>
                    </div>

                    <div className="space-y-6 px-7 py-7">
                        <h2 className="font-serif text-2xl font-bold leading-snug text-ink md:text-3xl">
                            {currentQuestion.question}
                        </h2>

                        {currentQuestion.sample_answer_hints && (
                            <div className="border-2 border-dashed border-seal/50 bg-seal/5 px-4 py-3">
                                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-seal">
                                    Examiner&apos;s note
                                </p>
                                <p className="mt-1 text-sm text-ink-2">
                                    {currentQuestion.sample_answer_hints}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                                Your answer — write on the lines
                            </p>
                            <textarea
                                value={answers[currentIndex]}
                                onChange={(e) => {
                                    const newAnswers = [...answers];
                                    newAnswers[currentIndex] = e.target.value;
                                    setAnswers(newAnswers);
                                }}
                                placeholder="Begin your answer…"
                                className="paper-ruled h-64 w-full resize-none border border-ink/25 bg-paper px-4 py-1 text-ink placeholder:text-ink-2/50 focus:border-stamp focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-between pt-2">
                            <Button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                variant="outline"
                                className="h-auto border-2 border-ink/30 bg-paper px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-ink hover:bg-paper disabled:opacity-40"
                            >
                                Previous
                            </Button>

                            {currentIndex < questions.length - 1 ? (
                                <Button
                                    onClick={() => setCurrentIndex(currentIndex + 1)}
                                    className="btn-hard h-auto bg-ink px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-2 hover:bg-ink"
                                >
                                    Next
                                    <ArrowRight className="ml-2" size={15} />
                                </Button>
                            ) : (
                                <Button
                                    onClick={submitAnswers}
                                    disabled={loading}
                                    className="btn-hard h-auto bg-stamp px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper-2 hover:bg-stamp"
                                >
                                    {loading ? 'Marking…' : 'Submit for review'}
                                    <CheckCircle className="ml-2" size={15} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>,
            'Answer the paper.',
            'Take your time. The examiner reads everything — twice.'
        );
    }

    // ── RESULTS ──
    if (stage === 'results' && results) {
        const passed = results.overall_score >= 70;

        return pageShell(
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Report card header */}
                <div className="relative mb-8 border-2 border-ink bg-paper-2 p-8 text-center shadow-[8px_10px_0_-4px_hsl(var(--ink))]">
                    <Tape className="-top-3 left-1/2 -translate-x-1/2" angle={-2} />
                    <Award className="mx-auto mb-4 h-12 w-12 text-gold" strokeWidth={1.4} />
                    <h2 className="font-serif text-3xl font-black text-ink">Examination complete.</h2>

                    <div className="mt-6 flex items-center justify-center gap-8">
                        <div>
                            <div className="font-serif text-7xl font-black leading-none text-ink">
                                {results.overall_score}
                                <span className="text-2xl text-stamp">%</span>
                            </div>
                            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                                overall mark
                            </p>
                        </div>
                        <div className="h-16 w-px bg-ink/20" />
                        <div className="text-left">
                            <Stamp tone={passed ? 'red' : 'ink'} animate>
                                {passed ? 'Passed' : 'Conditional'}
                            </Stamp>
                            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2">
                                {results.total_questions} questions marked
                            </p>
                        </div>
                    </div>
                </div>

                {/* Per-question reports */}
                <div className="space-y-6">
                    {results.questions.map((q: QuestionWithAnswer, idx: number) => (
                        <div key={idx} className="border border-ink/20 bg-paper-2 p-6">
                            <div className="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <div className="mb-1.5 flex flex-wrap gap-2">
                                        <Stamp tone="ink" flat className="text-[8px]!">
                                            {q.category.replace('_', ' ')}
                                        </Stamp>
                                        <Stamp
                                            tone={q.difficulty === 'easy' ? 'ink' : q.difficulty === 'medium' ? 'blue' : 'red'}
                                            flat
                                            className="text-[8px]!"
                                        >
                                            {q.difficulty}
                                        </Stamp>
                                    </div>
                                    <h3 className="font-serif text-lg font-bold leading-snug text-ink">
                                        {q.question}
                                    </h3>
                                </div>
                                <span className="shrink-0 border-2 border-ink bg-paper px-3 py-2 font-mono text-xl font-bold text-stamp shadow-[3px_3px_0_0_hsl(var(--ink))]">
                                    {q.score}/10
                                </span>
                            </div>

                            <div className="mb-3 border border-ink/20 bg-paper px-4 py-3">
                                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-2">
                                    Your answer
                                </p>
                                <p className="mt-1 text-sm text-ink">
                                    {q.user_answer || '— no answer given —'}
                                </p>
                            </div>

                            {q.ai_feedback && (
                                <div className="mb-4 border-2 border-dashed border-seal/50 bg-seal/5 px-4 py-3">
                                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-seal">
                                        Examiner&apos;s remarks
                                    </p>
                                    <p className="mt-1 text-sm text-ink-2">{q.ai_feedback}</p>
                                </div>
                            )}

                            {(q.strengths?.length || q.improvements?.length) && (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {q.strengths && q.strengths.length > 0 && (
                                        <div className="border border-ink/15 bg-paper p-3">
                                            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-stamp">
                                                Strengths
                                            </p>
                                            <ul className="space-y-1 text-sm text-ink-2">
                                                {q.strengths.map((s, i) => (
                                                    <li key={i} className="flex gap-2">
                                                        <span className="text-stamp">+</span>
                                                        {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {q.improvements && q.improvements.length > 0 && (
                                        <div className="border border-ink/15 bg-paper p-3">
                                            <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.22em] text-seal">
                                                To revise
                                            </p>
                                            <ul className="space-y-1 text-sm text-ink-2">
                                                {q.improvements.map((i, idx2) => (
                                                    <li key={idx2} className="flex gap-2">
                                                        <span className="text-seal">→</span>
                                                        {i}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        onClick={() => {
                            setStage('setup');
                            setQuestions([]);
                            setAnswers([]);
                            setCurrentIndex(0);
                            setResults(null);
                        }}
                        className="btn-hard h-auto bg-ink px-10 py-4 font-sans text-xs font-semibold uppercase tracking-[0.24em] text-paper-2 hover:bg-ink"
                    >
                        Sit again
                    </Button>
                </div>
            </motion.div>,
            'The report card.',
            'Filed in the back of your logbook. Revise, then return for round two.'
        );
    }

    return null;
}
