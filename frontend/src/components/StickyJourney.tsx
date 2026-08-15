"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { FileText, Target, Map, Video, LineChart } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ChapterLabel from "./logbook/ChapterLabel";
import Tape from "./logbook/Tape";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const steps = [
  {
    title: "Upload & Parse",
    description:
      "Securely upload your résumé or LinkedIn profile. The parsing engine instantly digitizes your career history with the care of a night archivist.",
    icon: <FileText className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80",
    caption: "PLATE A — THE RÉSUMÉ ARRIVES",
    tone: "text-stamp",
  },
  {
    title: "Analyze & Extract",
    description:
      "Language models extract your core competencies, then collate your profile against thousands of live job listings to name the gap.",
    icon: <Target className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    caption: "PLATE B — THE GAP, NAMED",
    tone: "text-seal",
  },
  {
    title: "Personalized Roadmaps",
    description:
      "Receive a week-by-week curriculum typeset for your specific gap — chapter numbers, study tips, and all.",
    icon: <Map className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
    caption: "PLATE C — THE PLAN, BOUND",
    tone: "text-plum",
  },
  {
    title: "Master & Prepare",
    description:
      "Study with a 24/7 companion and sit mock examinations — technical and behavioral — with examiner's remarks on every answer.",
    icon: <Video className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
    caption: "PLATE D — THE EXAMINATION",
    tone: "text-stamp",
  },
  {
    title: "Track & Succeed",
    description:
      "Watch the ledger fill, stamp each milestone, and walk into the role you've been drafting toward.",
    icon: <LineChart className="h-6 w-6" />,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    caption: "PLATE E — THE LEDGER, FULL",
    tone: "text-gold",
  },
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
    <section id="journey" className="relative bg-muted/40 py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16">
          <ChapterLabel index="03" title="The Journey" className="mb-6 max-w-md" />
          <h2 className="max-w-2xl font-serif text-4xl font-black leading-tight tracking-tight text-ink md:text-6xl">
            Scroll with us. <span className="text-stamp">Page by page.</span>
          </h2>
          <p className="mt-5 max-w-xl text-lg text-ink-2">
            An end-to-end route from raw experience to strategic advantage —
            the left margin narrates, the plate turns.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto flex max-w-6xl items-start gap-10">
          {/* Left column — scrolling narration */}
          <div className="relative w-full px-2 md:w-1/2">
            <div className="pb-[18vh]">
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="my-28 first:mt-6 last:mb-[28vh]"
                  initial={{ opacity: 0.35 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.35 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="mb-5 flex items-center gap-4">
                    <span className="font-serif text-5xl font-black leading-none text-ink/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className={`flex h-12 w-12 items-center justify-center border-2 border-ink bg-paper-2 ${step.tone}`}>
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="mb-3 font-serif text-3xl font-bold text-ink">
                    {step.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-ink-2">
                    {step.description}
                  </p>

                  {/* Mobile plate */}
                  <div className="relative mt-8 md:hidden">
                    <div className="relative overflow-hidden border-2 border-ink bg-ink shadow-[6px_6px_0_-2px_hsl(var(--stamp))]">
                      <Tape className="-top-3 left-1/2 -translate-x-1/2" angle={2} />
                      <img src={step.image} alt={step.title} className="img-plate h-48 w-full object-cover" />
                    </div>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2">
                      {step.caption}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column — sticky plate (desktop) */}
          <div className="sticky top-28 hidden h-[62vh] w-1/2 md:block">
            <div className="relative h-full w-full border-2 border-ink bg-ink shadow-[10px_12px_0_-4px_hsl(var(--stamp))]">
              <Tape className="-top-3 left-10" angle={-4} />
              <Tape className="-top-3 right-10" angle={5} />
              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="absolute inset-0 p-3"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: activeCard === index ? 1 : 0,
                    scale: activeCard === index ? 1 : 0.96,
                    zIndex: activeCard === index ? 10 : 0,
                  }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                >
                  <img
                    src={step.image}
                    alt={step.title}
                    className="img-plate h-full w-full object-cover"
                  />
                </motion.div>
              ))}
              <span className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap bg-paper-2/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2">
                {steps[activeCard].caption}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StickyJourney;
