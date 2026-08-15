"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Target, Map, MessageSquareText, Video, LineChart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ChapterLabel from "./logbook/ChapterLabel";
import Tape from "./logbook/Tape";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const features = [
  {
    index: "01",
    title: "Smart Résumé Parse",
    description:
      "Extract essential skills and experience automatically — every line of your past, filed and indexed.",
    icon: <FileText className="h-4 w-4 text-stamp" />,
    image:
      "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    caption: "PLATE 01 — THE RÉSUMÉ, DE-CLUTTERED",
    wide: true,
  },
  {
    index: "02",
    title: "Skill Gap Analysis",
    description:
      "Identify exactly what stands between you and the role you're chasing.",
    icon: <Target className="h-4 w-4 text-seal" />,
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    caption: "PLATE 02 — WHAT'S MISSING",
    wide: false,
  },
  {
    index: "03",
    title: "Personalized Roadmaps",
    description:
      "Step-by-step guidance typeset to your trajectory, week by numbered week.",
    icon: <Map className="h-4 w-4 text-plum" />,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    caption: "PLATE 03 — THE PLAN, PRINTED",
    wide: false,
  },
  {
    index: "04",
    title: "AI Study Buddy",
    description:
      "A 24/7 companion that annotates your roadmap in the margins and answers while you work.",
    icon: <MessageSquareText className="h-4 w-4 text-stamp" />,
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    caption: "PLATE 04 — MARGINALIA, LIVE",
    wide: true,
  },
  {
    index: "05",
    title: "Interview Prep",
    description:
      "Mock technical and behavioral examinations with examiner's remarks.",
    icon: <Video className="h-4 w-4 text-seal" />,
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
    caption: "PLATE 05 — THE EXAMINATION",
    wide: false,
  },
  {
    index: "06",
    title: "Growth Analytics",
    description:
      "Track progress visually and stamp each milestone as you clear it.",
    icon: <LineChart className="h-4 w-4 text-gold" />,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    caption: "PLATE 06 — THE LEDGER",
    wide: false,
  },
];

export default function FeaturesBento() {
  return (
    <section id="features" className="relative py-24">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-14">
          <ChapterLabel index="01" title="The Index" className="mb-6 max-w-md" />
          <h2 className="max-w-2xl font-serif text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl">
            Everything the logbook keeps{" "}
            <span className="relative inline-block text-stamp">
              between its covers
              <svg viewBox="0 0 260 40" preserveAspectRatio="none" fill="none" aria-hidden className="absolute -bottom-1 left-0 h-3 w-full">
                <path
                  d="M3 16 C 40 8, 110 7, 197 12 C 220 13, 232 12, 242 8"
                  stroke="hsl(var(--stamp) / 0.7)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-2">
            Six instruments, bound together. Each one earns its page in your
            career archive.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.index}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className={cn(
                "group relative flex flex-col border border-ink/15 bg-paper-2 p-5 shadow-[6px_6px_0_-2px_hsl(var(--ink))] transition-all duration-300 hover:-translate-y-1 hover:shadow-[9px_10px_0_-2px_hsl(var(--ink))]",
                f.wide && "md:col-span-2",
                i % 2 === 0 ? "md:rotate-[0.3deg]" : "md:-rotate-[0.3deg]"
              )}
            >
              <Tape className="-top-3 left-1/2 -translate-x-1/2" angle={i % 2 ? 3 : -3} />

              {/* Kept Unsplash photo, restyled as a vintage clipping */}
              <div className="relative mb-5 overflow-hidden border border-ink/20 bg-ink/5">
                <img
                  src={f.image}
                  alt={f.title}
                  loading="lazy"
                  className="img-plate h-44 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent" />
                <span className="absolute bottom-2 left-2 bg-paper-2/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.22em] text-ink-2">
                  {f.caption}
                </span>
              </div>

              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-2xl font-bold leading-snug text-ink">
                  {f.title}
                </h3>
                <span className="mt-1 font-mono text-xs text-stamp">{f.index}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {f.description}
              </p>
              <div className="mt-4 border-t border-dashed border-ink/20 pt-3 text-ink-2">
                {f.icon}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
