"use client";

import React from "react";
import { motion } from "framer-motion";
import { Database, Layout, Server, Brain, Code2, Bot, Feather } from "lucide-react";
import ChapterLabel from "./logbook/ChapterLabel";

const OrbitingDisc = ({
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ width: radius * 2, height: radius * 2 }}
    >
      <motion.div
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear", delay }}
        className="relative h-full w-full"
      >
        <div
          className={`absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-ink/30 bg-paper-2 text-ink shadow-[3px_3px_0_0_hsl(var(--ink)/0.35)] ${className}`}
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export default function TechOrbit() {
  return (
    <section id="platform" className="relative overflow-hidden bg-ink py-28 text-paper-2">
      {/* Night-page texture */}
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(hsl(var(--paper)/0.05)_1px,transparent_1px)] [background-size:5px_5px]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-stamp/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-seal/15 blur-3xl" />

      <div className="container relative mx-auto max-w-6xl px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <ChapterLabel
            index="04"
            title="The Press"
            className="mx-auto mb-6 max-w-sm [&::after]:bg-paper-2/40 [&_span]:text-stamp!"
            dark
          />
          <h2 className="font-serif text-4xl font-black leading-tight tracking-tight md:text-6xl">
            The machinery <span className="text-stamp">behind the ink.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-paper-2/70">
            Built on a robust, scalable architecture — the industry&apos;s best
            tools, typeset into a single quiet machine.
          </p>
        </div>

        <div className="relative mx-auto flex h-[420px] w-full max-w-[560px] items-center justify-center md:h-[560px]">
          {/* Center seal */}
          <div className="absolute z-20 flex h-28 w-28 flex-col items-center justify-center gap-1 border-2 border-paper-2/60 bg-paper-2 text-ink shadow-[5px_5px_0_0_hsl(var(--stamp))]">
            <Feather className="h-7 w-7 text-stamp" strokeWidth={1.6} />
            <span className="font-mono text-[9px] uppercase tracking-[0.28em]">
              the press
            </span>
          </div>

          {/* Printed rings */}
          <div className="absolute h-[210px] w-[210px] rounded-full border border-paper-2/25 md:h-[300px] md:w-[300px]" />
          <div className="absolute h-[320px] w-[320px] rounded-full border border-dashed border-paper-2/15 md:h-[460px] md:w-[460px]" />
          <div className="pointer-events-none absolute inset-0 rounded-full [background:repeating-conic-gradient(hsl(var(--paper)/0.04)_0deg_6deg,transparent_6deg_12deg)]" />

          {/* Inner discs */}
          <OrbitingDisc radius={105} duration={16} className="h-12 w-12 md:h-14 md:w-14">
            <Layout className="h-5 w-5" />
          </OrbitingDisc>
          <OrbitingDisc radius={105} duration={16} delay={8} reverse className="h-12 w-12 md:h-14 md:w-14">
            <Code2 className="h-5 w-5 text-stamp" />
          </OrbitingDisc>

          {/* Outer discs */}
          <OrbitingDisc radius={225} duration={26} className="h-14 w-14 md:h-16 md:w-16">
            <Server className="h-6 w-6 text-seal" />
          </OrbitingDisc>
          <OrbitingDisc radius={225} duration={26} delay={6.5} className="h-14 w-14 md:h-16 md:w-16">
            <Bot className="h-6 w-6 text-stamp" />
          </OrbitingDisc>
          <OrbitingDisc radius={225} duration={26} delay={13} className="h-14 w-14 md:h-16 md:w-16">
            <Brain className="h-6 w-6 text-plum" />
          </OrbitingDisc>
          <OrbitingDisc radius={225} duration={26} delay={19.5} className="h-14 w-14 md:h-16 md:w-16">
            <Database className="h-6 w-6 text-gold" />
          </OrbitingDisc>
        </div>

        <p className="mt-12 text-center font-mono text-[11px] uppercase tracking-[0.28em] text-paper-2/50">
          Type · React · Next.js — an insert page, printed nightly
        </p>
      </div>
    </section>
  );
}
