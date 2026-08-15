'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2, Feather } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    message: string;
    timestamp: string;
}

interface ChatWidgetProps {
    userId: string;
    roadmapId?: string;
}

import { chatWithAI, getChatHistory, clearChatHistory as apiClearHistory } from '@/lib/apiClient';
import Tape from './logbook/Tape';

export default function ChatWidget({ userId, roadmapId }: ChatWidgetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load chat history when opened
    useEffect(() => {
        if (isOpen && userId) {
            loadHistory();
        }
    }, [isOpen, userId, roadmapId]);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const loadHistory = async () => {
        try {
            const data = await getChatHistory(userId, roadmapId);
            setMessages(data.history || []);
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setLoading(true);

        // Add user message immediately
        const newUserMsg: Message = {
            role: 'user',
            message: userMessage,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newUserMsg]);

        try {
            const data = await chatWithAI(userId, userMessage, roadmapId);

            // Add AI response
            const aiMsg: Message = {
                role: 'assistant',
                message: data.response,
                timestamp: data.timestamp
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMsg: Message = {
                role: 'assistant',
                message: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const clearHistory = async () => {
        if (!confirm('Clear all chat history?')) return;

        try {
            await apiClearHistory(userId, roadmapId);
            setMessages([]);
        } catch (error) {
            console.error('Error clearing history:', error);
        }
    };

    return (
        <>
            {/* Floating button */}
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed bottom-8 right-8 z-[99]"
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        data-cursor="marginalia"
                        className="btn-hard group h-16 w-16 rounded-none border-2 border-ink bg-paper-2 hover:bg-paper-2"
                    >
                        <Feather className="h-7 w-7 text-stamp transition-transform group-hover:-rotate-12" strokeWidth={1.6} />
                    </Button>
                    <span className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-paper-2">
                        marginalia
                    </span>
                </motion.div>
            )}

            {/* Chat window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, rotate: 1 }}
                        animate={{ opacity: 1, y: 0, rotate: 0 }}
                        exit={{ opacity: 0, y: 20, rotate: 1 }}
                        className="fixed bottom-8 right-8 z-[99] w-[calc(100vw-2rem)] max-w-96 h-[600px]"
                    >
                        <div className="relative flex h-full flex-col border-2 border-ink bg-paper-2 shadow-[8px_10px_0_-4px_hsl(var(--stamp))]">
                            <Tape className="-top-3 left-1/2 -translate-x-1/2" angle={-3} />

                            {/* Header */}
                            <div className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center border-2 border-ink bg-paper text-stamp">
                                        <Feather className="h-4 w-4" strokeWidth={1.6} />
                                    </span>
                                    <div>
                                        <h3 className="font-serif text-lg font-bold leading-tight text-ink">
                                            The Study Buddy
                                        </h3>
                                        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-2">
                                            marginalia · live
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1.5">
                                    {messages.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearHistory}
                                            className="rounded-none text-ink-2 hover:bg-stamp/10 hover:text-stamp"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                        className="rounded-none text-ink hover:bg-ink/10"
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto space-y-4 p-5">
                                {messages.length === 0 ? (
                                    <div className="mt-8 text-center text-ink-2">
                                        <MessageCircle size={44} className="mx-auto mb-4 opacity-40" strokeWidth={1.4} />
                                        <p className="font-serif text-lg text-ink">The margins are yours.</p>
                                        <p className="mt-1 text-sm">Ask anything about your roadmap.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[82%] px-4 py-2.5 text-sm leading-relaxed ${
                                                    msg.role === 'user'
                                                        ? 'border-2 border-ink bg-ink text-paper-2 shadow-[3px_3px_0_0_hsl(var(--stamp))]'
                                                        : 'border border-ink/25 bg-paper text-ink'
                                                }`}
                                            >
                                                {msg.role === 'assistant' && (
                                                    <span className="mb-1 block font-mono text-[9px] uppercase tracking-[0.22em] text-stamp">
                                                        marginalia
                                                    </span>
                                                )}
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="border border-ink/25 bg-paper px-4 py-3">
                                            <div className="flex gap-1.5">
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-ink" style={{ animationDelay: '0ms' }} />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-ink" style={{ animationDelay: '150ms' }} />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-ink" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t-2 border-ink p-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Write in the margin…"
                                        className="flex-1 border border-ink/30 bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-ink-2 focus:border-stamp focus:outline-none"
                                        disabled={loading}
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        className="btn-hard h-auto rounded-none border-2 border-ink bg-ink px-4 text-paper-2 hover:bg-ink disabled:opacity-40"
                                    >
                                        <Send size={17} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
