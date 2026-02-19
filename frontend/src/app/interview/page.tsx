'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, TrendingUp, Clock, Award } from 'lucide-react';
import { generateInterview, submitInterview } from '@/lib/apiClient';

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

    const getCategoryBadge = (category: string) => {
        const colors: Record<string, string> = {
            technical: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
            behavioral: 'bg-green-500/20 text-green-400 border-green-500/50',
            system_design: 'bg-purple-500/20 text-purple-400 border-purple-500/50'
        };
        return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    };

    const getDifficultyColor = (diff: string) => {
        const colors: Record<string, string> = {
            easy: 'text-green-400',
            medium: 'text-yellow-400',
            hard: 'text-red-400'
        };
        return colors[diff] || 'text-gray-400';
    };

    // Setup View
    if (stage === 'setup') {
        return (
            <div className="min-h-screen bg-black p-8">
                {/* Back Button */}
                <div className="absolute top-8 left-8 z-20">
                    <a
                        href="/"
                        className="px-4 py-2 rounded-lg glass-panel border border-white/10 hover:border-primary/30 transition-all flex items-center gap-2 text-foreground hover:text-primary font-medium"
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
                            <path d="m12 19-7-7 7-7" />
                            <path d="M19 12H5" />
                        </svg>
                        Back
                    </a>
                </div>

                <div className="max-w-2xl mx-auto">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-4xl font-bold text-white mb-2">Interview Prep</h1>
                        <p className="text-gray-400 mb-8">Practice with AI-powered interview questions</p>

                        <Card className="p-8 bg-black/40 backdrop-blur-xl border-2 border-primary/30">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Target Role</label>
                                    <input
                                        type="text"
                                        value={targetRole}
                                        onChange={(e) => setTargetRole(e.target.value)}
                                        placeholder="e.g., Full Stack Developer"
                                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Difficulty</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['easy', 'medium', 'hard'].map((diff) => (
                                            <button
                                                key={diff}
                                                onClick={() => setDifficulty(diff)}
                                                className={`py-3 rounded-lg font-medium transition-all ${difficulty === diff
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                {diff.charAt(0).toUpperCase() + diff.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">
                                        Number of Questions: {questionCount}
                                    </label>
                                    <input
                                        type="range"
                                        min="3"
                                        max="10"
                                        value={questionCount}
                                        onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                                        className="w-full"
                                    />
                                </div>

                                <Button
                                    onClick={startInterview}
                                    disabled={loading || !targetRole.trim()}
                                    className="w-full py-6 bg-primary hover:bg-primary/90 text-lg font-semibold"
                                >
                                    {loading ? 'Generating Questions...' : 'Start Interview'}
                                    <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Practice View
    if (stage === 'practice') {
        const currentQuestion = questions[currentIndex];

        return (
            <div className="min-h-screen bg-black p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-white">
                                Question {currentIndex + 1} of {questions.length}
                            </h1>
                            <div className="text-sm text-gray-400">
                                Progress: {Math.round(((currentIndex + 1) / questions.length) * 100)}%
                            </div>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>

                    <Card className="p-8 bg-black/40 backdrop-blur-xl border-2 border-primary/30">
                        <div className="flex gap-3 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadge(currentQuestion.category)}`}>
                                {currentQuestion.category.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                                {currentQuestion.difficulty.toUpperCase()}
                            </span>
                        </div>

                        <h2 className="text-2xl font-semibold text-white mb-6">{currentQuestion.question}</h2>

                        {currentQuestion.sample_answer_hints && (
                            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                <p className="text-sm text-blue-300">
                                    <strong>Hint:</strong> {currentQuestion.sample_answer_hints}
                                </p>
                            </div>
                        )}

                        <textarea
                            value={answers[currentIndex]}
                            onChange={(e) => {
                                const newAnswers = [...answers];
                                newAnswers[currentIndex] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            placeholder="Type your answer here..."
                            className="w-full h-64 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 resize-none"
                        />

                        <div className="flex justify-between mt-6">
                            <Button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                variant="outline"
                                className="border-white/20"
                            >
                                Previous
                            </Button>

                            {currentIndex < questions.length - 1 ? (
                                <Button onClick={() => setCurrentIndex(currentIndex + 1)} className="bg-primary hover:bg-primary/90">
                                    Next
                                    <ArrowRight className="ml-2" size={16} />
                                </Button>
                            ) : (
                                <Button onClick={submitAnswers} disabled={loading} className="bg-green-600 hover:bg-green-700">
                                    {loading ? 'Evaluating...' : 'Submit for Evaluation'}
                                    <CheckCircle className="ml-2" size={16} />
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    // Results View
    if (stage === 'results' && results) {
        return (
            <div className="min-h-screen bg-black p-8">
                <div className="max-w-5xl mx-auto">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="text-center mb-8">
                            <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                            <h1 className="text-4xl font-bold text-white mb-2">Interview Complete!</h1>
                            <div className="text-6xl font-bold text-primary my-4">{results.overall_score}%</div>
                            <p className="text-gray-400">Overall Score</p>
                        </div>

                        <div className="space-y-6">
                            {results.questions.map((q: QuestionWithAnswer, idx: number) => (
                                <Card key={idx} className="p-6 bg-black/40 backdrop-blur-xl border-2 border-white/10">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex gap-2 mb-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium border ${getCategoryBadge(q.category)}`}>
                                                    {q.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white mb-2">{q.question}</h3>
                                        </div>
                                        <div className="text-2xl font-bold text-primary ml-4">{q.score}/10</div>
                                    </div>

                                    <div className="mb-4 p-3 bg-white/5 rounded-lg">
                                        <p className="text-sm text-gray-300"><strong>Your Answer:</strong> {q.user_answer || 'No answer provided'}</p>
                                    </div>

                                    <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg mb-3">
                                        <p className="text-sm text-blue-200"><strong>AI Feedback:</strong> {q.ai_feedback}</p>
                                    </div>

                                    {q.strengths && q.strengths.length > 0 && (
                                        <div className="mb-2">
                                            <p className="text-sm font-semibold text-green-400 mb-1">Strengths:</p>
                                            <ul className="list-disc list-inside text-sm text-gray-300">
                                                {q.strengths.map((s, i) => (
                                                    <li key={i}>{s}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {q.improvements && q.improvements.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-yellow-400 mb-1">Areas to Improve:</p>
                                            <ul className="list-disc list-inside text-sm text-gray-300">
                                                {q.improvements.map((i, idx) => (
                                                    <li key={idx}>{i}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>

                        <div className="flex gap-4 mt-8 justify-center">
                            <Button
                                onClick={() => {
                                    setStage('setup');
                                    setQuestions([]);
                                    setAnswers([]);
                                    setCurrentIndex(0);
                                    setResults(null);
                                }}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Try Again
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return null;
}
