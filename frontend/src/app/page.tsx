"use client";

import React from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import FeaturesBento from "@/components/FeaturesBento";
import SetupTimeline from "@/components/SetupTimeline";
import StickyJourney from "@/components/StickyJourney";
import TechOrbit from "@/components/TechOrbit";
import Marquee from "@/components/logbook/Marquee";
import Stamp from "@/components/logbook/Stamp";
import Cursor from "@/components/logbook/Cursor";
import { ArrowUpRight, Star } from "lucide-react";

const contents = [
  { n: "01", label: "Index", href: "#features" },
  { n: "02", label: "Process", href: "#process" },
  { n: "03", label: "Journey", href: "#journey" },
  { n: "04", label: "Press", href: "#platform" },
];

function Masthead() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/15 bg-paper/90 backdrop-blur-md">
      <div className="container mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center bg-ink font-serif text-sm font-black text-paper-2 shadow-hard-sm">
            ACN
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-lg font-bold tracking-tight text-ink">
              The Career Navigator
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-ink-2">
              an AI logbook · vol. I
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {contents.map((c) => (
            <a
              key={c.n}
              href={c.href}
              className="group font-mono text-[11px] uppercase tracking-[0.22em] text-ink-2 transition-colors hover:text-ink"
            >
              <span className="mr-1.5 text-stamp">{c.n}</span>
              {c.label}
              <span className="mt-0.5 block h-px max-w-0 bg-stamp transition-all duration-300 group-hover:max-w-full" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/StealthPanther/ai-career-navigator"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-2 transition-colors hover:text-ink sm:flex"
          >
            <Star className="h-3.5 w-3.5" />
            Star us
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href="/dashboard"
            data-cursor="open"
            className="btn-hard bg-ink px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-paper-2"
          >
            Open dossier
          </a>
        </div>
      </div>
    </header>
  );
}

function Colophon() {
  return (
    <footer className="relative overflow-hidden border-t-2 border-ink">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="container relative mx-auto max-w-6xl px-4 pb-10 pt-20">
        <div className="mb-14 flex items-end justify-between gap-6">
          <h2 className="font-serif text-5xl font-black tracking-tight text-ink md:text-6xl">
            The End.
            <span className="ml-3 inline-block align-baseline font-mono text-sm font-normal uppercase tracking-[0.3em] text-ink-2">
              — colophon
            </span>
          </h2>
          <Stamp tone="red" className="hidden md:inline-block">
            Archived
          </Stamp>
        </div>

        <div className="grid grid-cols-1 gap-12 border-t border-ink/15 pt-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center bg-ink font-serif text-xs font-black text-paper-2">
                ACN
              </span>
              <span className="font-serif text-lg font-bold text-ink">
                The Career Navigator
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink-2">
              Set in Fraunces &amp; Inter, printed on recycled pixels. This
              logbook was typeset at 4 a.m. over too much coffee, and bound with
              tape, stamps, and a stubborn belief that your next role is closer
              than you think.
            </p>
            <a
              href="https://github.com/StealthPanther/ai-career-navigator"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border-b border-stamp/40 pb-1 font-mono text-[11px] uppercase tracking-[0.22em] text-stamp transition-colors hover:border-stamp"
            >
              <Star className="h-3.5 w-3.5" />
              Drop a star on GitHub
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
              Contents
            </h4>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-2">
              {contents.map((c) => (
                <li key={c.n}>
                  <a href={c.href} className="transition-colors hover:text-stamp">
                    {c.n} — {c.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="/dashboard" className="transition-colors hover:text-stamp">
                  05 — The Dossier
                </a>
              </li>
              <li>
                <a href="/interview" className="transition-colors hover:text-stamp">
                  06 — The Examination
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-ink">
              Appendix
            </h4>
            <ul className="space-y-2.5 font-mono text-xs uppercase tracking-[0.16em] text-ink-2">
              <li>
                <a
                  href="https://github.com/StealthPanther/ai-career-navigator#readme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-stamp"
                >
                  Documentation ↗
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-stamp"
                >
                  API Reference ↗
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/StealthPanther/ai-career-navigator/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-stamp"
                >
                  Marginalia (Discussions) ↗
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-stamp">
                  X (Twitter)
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-stamp">
                  Discord
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-ink/15 pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-2 md:flex-row">
          <p>© {new Date().getFullYear()} AI Career Navigator · all rights reserved</p>
          <p className="flex items-center gap-4">
            <span>Vol. I · No. 1</span>
            <span className="text-stamp">✦</span>
            <span>p. 01</span>
          </p>
          <div className="flex gap-4">
            <a href="#" className="transition-colors hover:text-ink">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-ink">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen bg-paper font-sans text-ink selection:bg-stamp selection:text-paper-2">
      <Cursor />
      <Masthead />
      <Hero />

      <Marquee
        speed={36}
        items={[
          "Upload résumé",
          "Gap analysis",
          "Week-by-week roadmap",
          "AI study buddy",
          "Mock interviews",
          "Market intel",
        ]}
      />

      <FeaturesBento />
      <SetupTimeline />
      <StickyJourney />
      <TechOrbit />
      <Colophon />
    </main>
  );
}
