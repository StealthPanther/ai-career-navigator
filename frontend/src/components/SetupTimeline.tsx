"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, Cpu, Target, Rocket } from "lucide-react";

export const SetupTimeline = () => {
    const steps = [
        {
            title: "Upload Profile",
            description: "Securely upload your resume or LinkedIn profile. Our parsing engine instantly digitizes your career history.",
            icon: <UploadCloud className="w-8 h-8 text-neural-blue" />,
            color: "from-blue-500/20 to-transparent",
            borderColor: "border-blue-500/30",
        },
        {
            title: "AI Skill Extraction",
            description: "Proprietary NLP models extract your core competencies, hard skills, and hidden strengths with surgical precision.",
            icon: <Cpu className="w-8 h-8 text-synapse-purple" />,
            color: "from-purple-500/20 to-transparent",
            borderColor: "border-purple-500/30",
        },
        {
            title: "Market Gap Analysis",
            description: "We compare your profile against thousands of real-time job listings to identify missing skills for your dream role.",
            icon: <Target className="w-8 h-8 text-emerald-400" />,
            color: "from-emerald-500/20 to-transparent",
            borderColor: "border-emerald-500/30",
        },
        {
            title: "Actionable Roadmap",
            description: "Receive a week-by-week, personalized curriculum designed to bridge your skill gap and land the job.",
            icon: <Rocket className="w-8 h-8 text-amber-400" />,
            color: "from-amber-500/20 to-transparent",
            borderColor: "border-amber-500/30",
        },
    ];

    return (
        <section className="py-24 relative max-w-7xl mx-auto px-4 z-10">
            <div className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-neural-blue to-synapse-purple">Works</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Our intelligent platform transforms your raw experience into a strategic career advantage in four seamless steps.
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="relative group"
                    >
                        {/* Connecting Line (Desktop only) */}
                        {idx < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-12 left-[60%] w-[calc(100%-20%)] h-[2px] bg-gradient-to-r from-white/10 to-transparent -z-10" />
                        )}

                        <div className={`h-full glass-panel p-8 rounded-3xl border border-white/5 hover:${step.borderColor} transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-${step.borderColor.split('-')[1]}/20 relative overflow-hidden`}>
                            {/* Background Glow */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${step.color} rounded-full blur-2xl -z-10 opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="w-16 h-16 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                                {step.icon}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                <span className="text-sm font-mono text-muted-foreground/50">0{idx + 1}</span>
                                {step.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default SetupTimeline;
