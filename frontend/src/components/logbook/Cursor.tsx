"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * The Logbook's custom cursor: a small ink dot with a trailing ring.
 * On hover over interactive elements the ring tightens; elements carrying
 * a `data-cursor` attribute show that text inside the ring.
 * Only activates on fine pointers (mouse), never on touch.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // Enable on the next frame so we don't setState synchronously in the effect.
    const raf = requestAnimationFrame(() => {
      setEnabled(true);
      document.documentElement.classList.add("custom-cursor-active");
    });

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest("a, button, [role='button'], input, textarea, select, [data-cursor]");
      setHovering(Boolean(interactive));
      setLabel(interactive?.getAttribute("data-cursor") || null);
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", move);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Ink dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-2.5 w-2.5 rounded-full bg-ink"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      {/* Trailing ring / label bubble */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[199] flex items-center justify-center rounded-full border border-stamp bg-paper-2/80 backdrop-blur-[2px]"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 88 : hovering ? 40 : 28,
          height: label ? 88 : hovering ? 40 : 28,
          opacity: 0.9,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stamp">
            {label}
          </span>
        )}
      </motion.div>
    </>
  );
}
