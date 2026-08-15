"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import ChapterLabel from "./logbook/ChapterLabel";
import Scribble from "./logbook/Scribble";
import Stamp from "./logbook/Stamp";
import Tape from "./logbook/Tape";

const words = ["Your", "career,", "drafted,", "proofed,", "&"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 md:pt-36 pb-24">
      {/* Soft ink washes on the paper */}
      <div className="pointer-events-none absolute -top-32 -right-40 h-[34rem] w-[34rem] rounded-full bg-seal/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-44 h-[30rem] w-[30rem] rounded-full bg-stamp/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

      <div className="container relative mx-auto max-w-6xl px-4">
        <ChapterLabel index="00" title="Frontispiece" className="mb-10 max-w-md" />

        <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
          {/* ── Editorial headline ── */}
          <div>
            <motion.h1
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
              className="font-serif text-[clamp(2.9rem,7vw,5.4rem)] leading-[0.98] tracking-tight text-ink"
            >
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 26, rotate: i % 2 ? 1.5 : -1 },
                    show: { opacity: 1, y: 0, rotate: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 120, damping: 16 }}
                  className="mr-[0.28em] inline-block"
                >
                  {w}
                </motion.span>
              ))}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="relative mr-[0.28em] inline-block font-wonk text-stamp"
              >
                published.
                <Scribble
                  variant="squiggle"
                  className="absolute -bottom-2 left-0 w-full"
                />
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-8 max-w-xl text-lg leading-relaxed text-ink-2"
            >
              Upload your résumé, pick a target role, and this logbook prints you a{" "}
              <em className="font-serif text-ink">week-by-week learning plan</em> —
              typeset from live market data, annotated by an AI editor who never sleeps.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              <a
                href="/dashboard"
                data-cursor="open"
                className="btn-hard group inline-flex items-center gap-3 bg-ink px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-paper-2"
              >
                Open your dossier
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#process"
                className="group inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-mono text-xs uppercase tracking-[0.22em] text-ink-2 transition-colors hover:border-stamp hover:text-stamp"
              >
                Read the process
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </motion.div>

            {/* Ledger line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-ink/15 pt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2"
            >
              <span>10+ target roles</span>
              <span className="text-stamp">✦</span>
              <span>12-week roadmaps</span>
              <span className="text-stamp">✦</span>
              <span>24/7 study companion</span>
            </motion.div>
          </div>

          {/* ── Framed plate (the kept Spline scene) ── */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: 1.5 }}
            animate={{ opacity: 1, y: 0, rotate: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative border-[3px] border-ink bg-ink shadow-[10px_12px_0_-2px_hsl(var(--stamp))]">
              <Tape className="-top-3 left-8" angle={-4} />
              <Tape className="-top-3 right-8" angle={5} />
              <div className="relative aspect-[4/3] overflow-hidden bg-[#0c1016]">
                <iframe
                  src="https://my.spline.design/aigreymarketingbanner-C7K27wJ823BZEPqwqQ4x1gQO/"
                  frameBorder="0"
                  title="Spline 3D plate"
                  className="h-full w-full scale-[1.18] object-cover opacity-90 [filter:grayscale(0.55)_sepia(0.35)_contrast(1.1)]"
                />
                {/* Aged-glass wash over the plate */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-ink/40 via-transparent to-paper-2/10" />
                <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(hsl(var(--paper)/0.07)_1px,transparent_1px)] [background-size:4px_4px]" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2">
              <span>Fig. 01 — The viewport. Your career, in motion.</span>
              <Stamp tone="red" className="hidden sm:inline-block">
                Est. MMXXVI
              </Stamp>
            </div>

            {/* Marginalia */}
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -right-3 top-1/3 hidden -translate-y-1/2 rotate-[-4deg] lg:block"
            >
              <p className="max-w-[11rem] border border-ink/20 bg-paper-2/90 p-3 font-mono text-[11px] leading-relaxed tracking-wide text-ink-2">
                <span className="text-stamp">←</span> Your career deserves an
                editor. Consider this logbook yours.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
