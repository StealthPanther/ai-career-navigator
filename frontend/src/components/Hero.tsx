"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";




export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neural-blue/30 rounded-full blur-[120px] -z-10 mix-blend-screen" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-synapse-purple/20 rounded-full blur-[120px] -z-10 mix-blend-screen" />

            {/* Spline 3D Scene - Iframe Embed to bypass React 19 incompatibilities */}
            <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none">
                <iframe
                    src='https://my.spline.design/aigreymarketingbanner-C7K27wJ823BZEPqwqQ4x1gQO/'
                    frameBorder='0'
                    width='100%'
                    height='100%'
                    title="Spline 3D Background"
                    className="w-full h-full object-cover scale-[1.2]"
                ></iframe>
            </div>

            {/* Gradient Fade for smooth transition into the next section */}
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />

            <div className="container px-4 mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-neural-blue/30 mb-8 animate-pulse-slow">
                        <span className="w-2 h-2 rounded-full bg-neural-blue animate-pulse"></span>
                        <span className="text-sm font-medium text-neural-blue">Introducing AI Career Navigator 2.0</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Navigate Your AI Career with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-neural-blue to-synapse-purple filter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                            Superhuman Precision
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        AI-powered resume parsing, gap analysis, and tailored roadmaps to accelerate your journey in the tech industry.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <motion.a
                            href="/dashboard"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full bg-neural-blue text-white font-semibold flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all"
                        >
                            Launch App <Play className="w-4 h-4" />
                        </motion.a>
                        <motion.a
                            href="#features"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-full glass-panel text-white font-semibold hover:bg-white/5 transition-colors"
                        >
                            Explore Features
                        </motion.a>
                    </div>
                </motion.div>


            </div>

        </section>
    );
}
