"use client";

import React from "react";
import { motion } from "framer-motion";
import { UploadCloud, Cpu, Target, Rocket } from "lucide-react";
import ChapterLabel from "./logbook/ChapterLabel";

const steps = [
  {
    title: "Upload Profile",
    description:
      "Securely upload your résumé or LinkedIn profile. The parsing engine digitizes your entire career history, line by line.",
    icon: <UploadCloud className="h-5 w-5" />,
    tone: "text-seal",
    ink: "text-stamp",
  },
  {
    title: "AI Skill Extraction",
    description:
      "Language models extract your competencies, hard skills, and the hidden strengths your résumé never says out loud.",
    icon: <Cpu className="h-5 w-5" />,
    tone: "text-plum",
    ink: "text-stamp",
  },
  {
    title: "Market Gap Analysis",
    description:
      "Your profile is collated against thousands of live job postings to name exactly what's missing for the role you want.",
    icon: <Target className="h-5 w-5" />,
    tone: "text-seal",
    ink: "text-stamp",
  },
  {
    title: "Actionable Roadmap",
    description:
      "A week-by-week curriculum is printed and bound — study tips, resources, and a weekend project for every chapter.",
    icon: <Rocket className="h-5 w-5" />,
    tone: "text-stamp",
    ink: "text-stamp",
  },
];

export default function SetupTimeline() {
  return (
    <section id="process" className="relative py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-14">
          <ChapterLabel index="02" title="The Process" className="mb-6 max-w-md" />
          <h2 className="max-w-2xl font-serif text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl">
            Four moves, <span className="text-stamp">in order.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-2">
            No fluff, no forty-step funnels. The whole machine fits on a single
            page — proceed through it in sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 border-t-2 border-ink md:grid-cols-4">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative border-b border-ink/15 p-7 transition-colors duration-300 hover:bg-paper-2 md:border-b-0 md:border-l md:first:border-l-0"
            >
              <div className="mb-8 flex items-baseline justify-between">
                <span className="font-serif text-6xl font-black leading-none text-ink/15 transition-colors duration-300 group-hover:text-stamp/80">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className={`${step.tone} transition-transform duration-300 group-hover:-rotate-12`}>
                  {step.icon}
                </span>
              </div>
              <h3 className="mb-3 font-serif text-2xl font-bold text-ink">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-ink-2">
                {step.description}
              </p>
              <div className="mt-6 h-1 w-8 bg-stamp transition-all duration-500 group-hover:w-16" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
