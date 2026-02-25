"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Layout, Server, Brain, Code2, Bot } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const OrbitingCircle = ({
    className,
    children,
    reverse,
    duration = 20,
    delay = 0,
    radius = 50,
}: {
    className?: string;
    children?: React.ReactNode;
    reverse?: boolean;
    duration?: number;
    delay?: number;
    radius?: number;
}) => {
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
                width: radius * 2,
                height: radius * 2,
            }}
        >
            <motion.div
                animate={{ rotate: reverse ? -360 : 360 }}
                transition={{ repeat: Infinity, duration, ease: "linear", delay }}
                className="w-full h-full relative"
            >
                <div
                    className={cn(
                        "absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full glass-panel shadow-[0_0_20px_rgba(59,130,246,0.3)]",
                        className
                    )}
                >
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export default function TechOrbit() {
    return (
        <section className="py-24 relative overflow-hidden flex flex-col items-center justify-center">
            <div className="text-center mb-16 relative z-20">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                    Powered by <span className="text-gradient-primary">Modern Tech</span>
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                    Built on a robust, scalable architecture using the industry's best tools.
                </p>
            </div>

            <div className="relative w-full max-w-[600px] h-[400px] md:h-[600px] flex items-center justify-center mt-10">
                {/* Core Center */}
                <div className="absolute z-20 w-24 h-24 rounded-full bg-black border border-neural-blue shadow-[0_0_40px_rgba(59,130,246,0.5)] flex items-center justify-center animate-pulse">
                    <Brain className="w-10 h-10 text-neural-blue" />
                </div>

                {/* Inner Ring */}
                <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] rounded-full border border-white/10" />
                {/* Outer Ring */}
                <div className="absolute w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border border-white/5 border-dashed" />

                {/* Orbiting Elements - Inner */}
                <OrbitingCircle radius={100} duration={15} className="w-12 h-12 md:w-16 md:h-16">
                    <Layout className="w-5 h-5 md:w-8 md:h-8 text-white" />
                </OrbitingCircle>
                <OrbitingCircle radius={100} duration={15} delay={7.5} reverse className="w-12 h-12 md:w-16 md:h-16">
                    <Code2 className="w-5 h-5 md:w-8 md:h-8 text-cyan-400" />
                </OrbitingCircle>

                {/* Orbiting Elements - Outer */}
                <OrbitingCircle radius={225} duration={25} className="w-14 h-14 md:w-16 md:h-16">
                    <Server className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                </OrbitingCircle>
                <OrbitingCircle radius={225} duration={25} delay={6.25} className="w-14 h-14 md:w-16 md:h-16">
                    <Bot className="w-6 h-6 md:w-8 md:h-8 text-synapse-purple" />
                </OrbitingCircle>
                <OrbitingCircle radius={225} duration={25} delay={12.5} className="w-14 h-14 md:w-16 md:h-16">
                    <Brain className="w-6 h-6 md:w-8 md:h-8 text-rose-400" />
                </OrbitingCircle>
                <OrbitingCircle radius={225} duration={25} delay={18.75} className="w-14 h-14 md:w-16 md:h-16">
                    <Database className="w-6 h-6 md:w-8 md:h-8 text-yellow-400" />
                </OrbitingCircle>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
