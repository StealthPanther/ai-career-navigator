'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Trash2 } from 'lucide-react';

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
            {/* Floating Button */}
            {!isOpen && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="fixed bottom-8 right-8 z-9999"
                >
                    <Button
                        onClick={() => setIsOpen(true)}
                        className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/50 border-2 border-primary/30"
                    >
                        <MessageCircle size={28} />
                    </Button>
                </motion.div>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-9999 w-96 h-[600px]"
                    >
                        <Card className="h-full flex flex-col backdrop-blur-xl bg-black/80 border-2 border-primary/30 shadow-2xl shadow-primary/20">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MessageCircle className="text-primary" size={24} />
                                    <h3 className="font-bold text-lg text-foreground">AI Study Buddy</h3>
                                </div>
                                <div className="flex gap-2">
                                    {messages.length > 0 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={clearHistory}
                                            className="hover:bg-red-500/10"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground mt-8">
                                        <MessageCircle size={48} className="mx-auto mb-4 opacity-50" />
                                        <p className="text-sm">Ask me anything about your learning roadmap!</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => (
                                        <div
                                            key={idx}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                    ? 'bg-primary text-white'
                                                    : 'bg-white/10 text-foreground'
                                                    }`}
                                            >
                                                <p className="text-sm">{msg.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white/10 rounded-2xl px-4 py-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                        placeholder="Ask me anything..."
                                        className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                                        disabled={loading}
                                    />
                                    <Button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || loading}
                                        className="px-4 bg-primary hover:bg-primary/90"
                                    >
                                        <Send size={18} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
