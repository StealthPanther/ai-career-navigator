"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Target, Map, MessageSquareText, Video, LineChart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
}) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
                "row-span-1 rounded-xl group/bento transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4 glass-panel",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200">
                <div className="text-neural-blue mb-2">{icon}</div>
                <div className="font-sans font-bold text-neural-blue dark:text-neural-blue mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-muted-foreground text-xs dark:text-neutral-300">
                    {description}
                </div>
            </div>
        </motion.div>
    );
};

export default function FeaturesBento() {
    const features = [
        {
            title: "Smart Resume Parse",
            description: "Extract essential skills and experience automatically with superhuman precision.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-neural-blue/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80" alt="Resume Parse" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <FileText className="h-4 w-4 text-neural-blue" />,
        },
        {
            title: "Skill Gap Analysis",
            description: "Identify exactly what you need to learn to land your dream role.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-synapse-purple/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Data Analysis" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <Target className="h-4 w-4 text-synapse-purple" />,
        },
        {
            title: "Personalized Roadmaps",
            description: "Step-by-step guidance tailored to your unique career trajectory.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-blue-500/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" alt="Workflow Path" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <Map className="h-4 w-4 text-blue-400" />,
        },
        {
            title: "AI Study Buddy",
            description: "24/7 intelligent companion to answer technical questions and guide learning.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80" alt="AI Neural Network" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <MessageSquareText className="h-4 w-4 text-emerald-400" />,
        },
        {
            title: "Interview Prep",
            description: "Mock technical interviews and behavioral questions with instant feedback.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-rose-500/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80" alt="Tech Interview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <Video className="h-4 w-4 text-rose-400" />,
        },
        {
            title: "Growth Analytics",
            description: "Track your progress visually and celebrate your career milestones.",
            header: (
                <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-amber-500/20 mix-blend-overlay z-10"></div>
                    <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80" alt="Analytics Chart" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
            ),
            icon: <LineChart className="h-4 w-4 text-amber-400" />,
        },
    ];

    return (
        <section id="features" className="py-24 relative overflow-hidden bg-black/50">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
            <div className="container px-4 mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
                        Accelerate with <span className="text-gradient">AI Superpowers</span>
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Everything you need to navigate the tech industry, powered by the most advanced LLMs.
                    </p>
                </div>
                <BentoGrid className="max-w-6xl mx-auto">
                    {features.map((item, i) => (
                        <BentoGridItem
                            key={i}
                            title={item.title}
                            description={item.description}
                            header={item.header}
                            icon={item.icon}
                            className={i === 0 || i === 3 ? "md:col-span-2" : ""}
                        />
                    ))}
                </BentoGrid>
            </div>
        </section>
    );
}
