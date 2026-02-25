"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FileText, Target, Map, Video, LineChart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const steps = [
    {
        title: "Upload & Parse",
        description: "Securely upload your resume or LinkedIn profile. Our parsing engine instantly digitizes your career history with superhuman precision.",
        icon: <FileText className="w-8 h-8 text-neural-blue" />,
        image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
        color: "bg-neural-blue/20"
    },
    {
        title: "Analyze & Extract",
        description: "Proprietary NLP models extract your core competencies. We compare your profile against thousands of real-time job listings to identify exactly what you need to learn.",
        icon: <Target className="w-8 h-8 text-synapse-purple" />,
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        color: "bg-synapse-purple/20"
    },
    {
        title: "Personalized Roadmaps",
        description: "Receive a week-by-week, personalized curriculum designed to bridge your skill gap and land your dream job with step-by-step guidance.",
        icon: <Map className="w-8 h-8 text-blue-400" />,
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
        color: "bg-blue-500/20"
    },
    {
        title: "Master & Prepare",
        description: "Master your skills with our 24/7 intelligent companion and prepare for the real thing with mock technical and behavioral interviews offering instant feedback.",
        icon: <Video className="w-8 h-8 text-emerald-400" />,
        image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
        color: "bg-emerald-500/20"
    },
    {
        title: "Track & Succeed",
        description: "Track your progress visually, celebrate your career milestones, and land the tech job you deserve.",
        icon: <LineChart className="w-8 h-8 text-amber-400" />,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
        color: "bg-amber-500/20"
    }
];

export const StickyJourney = () => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    const cardLength = steps.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = steps.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <section id="how-it-works" className="py-24 relative bg-black/80">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[60px_60px]" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Your <span className="text-transparent bg-clip-text bg-linear-to-r from-neural-blue to-synapse-purple">Career Journey</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Accelerate with AI Superpowers. Experience a seamless, end-to-end platform that transforms your raw experience into a strategic advantage.
                    </p>
                </div>

                <div ref={ref} className="flex justify-center relative space-x-10 max-w-6xl mx-auto items-start">
                    {/* Left Column (Scrolling Text) */}
                    <div className="w-full md:w-1/2 relative px-4">
                        <div className="pb-[20vh]">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.title}
                                    className="my-32 2xl:my-48 first:mt-10 last:mb-[30vh]"
                                    initial={{ opacity: 0.3 }}
                                    animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-2xl bg-black/50 border border-white/10 shadow-xl">
                                        {step.icon}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                        <span className="text-sm font-mono text-muted-foreground/50">0{index + 1}</span>
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>

                                    {/* Mobile Image (hidden on desktop) */}
                                    <div className="md:hidden mt-8 w-full h-[30vh] rounded-2xl overflow-hidden relative glass-panel border border-white/10 shadow-2xl">
                                        <div className={cn("absolute inset-0 mix-blend-overlay z-10", step.color)}></div>
                                        <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (Sticky Images Desktop) */}
                    <div className="hidden md:block w-1/2 sticky top-32 h-[60vh] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                className={cn("absolute inset-0 p-4")}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0,
                                    scale: activeCard === index ? 1 : 0.9,
                                    zIndex: activeCard === index ? 10 : 0
                                }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            >
                                <div className="w-full h-full relative rounded-2xl overflow-hidden">
                                    <div className={cn("absolute inset-0 mix-blend-overlay z-10", step.color)}></div>
                                    <img src={step.image} alt={step.title} className="w-full h-full object-cover shadow-2xl" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default StickyJourney;
