"use client";

import { motion } from "framer-motion";

const PATHS: Record<string, string> = {
  underline:
    "M3 16 C 40 8, 110 7, 197 12 C 220 13, 232 12, 242 8",
  squiggle:
    "M4 12 C 20 4, 34 20, 50 12 C 66 4, 80 20, 96 12 C 112 4, 126 20, 142 12 C 158 4, 172 20, 188 12 C 204 4, 218 20, 234 12 C 242 8, 248 9, 252 12",
  arrow:
    "M3 8 C 60 4, 150 2, 240 6 M210 2 L242 6 L208 12",
  circle:
    "M130 5 C 198 5, 252 45, 252 110 C 252 175, 198 215, 130 215 C 62 215, 8 175, 8 110 C 8 45, 62 5, 130 5",
  bracket:
    "M10 10 L10 220 L244 220 M10 10 L244 10 L244 220",
};

interface ScribbleProps {
  variant?: "underline" | "squiggle" | "arrow" | "circle" | "bracket";
  className?: string;
  strokeWidth?: number;
}

/**
 * Hand-drawn SVG linework that inks itself in as it scrolls into view.
 * Used for editorial annotations: underlines, arrows, circled words.
 */
export default function Scribble({
  variant = "underline",
  className,
  strokeWidth = 3.5,
}: ScribbleProps) {
  return (
    <motion.svg
      viewBox="0 0 260 40"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className={className}
      style={{ height: variant === "circle" || variant === "bracket" ? "100%" : "0.6em" }}
    >
      <motion.path
        d={PATHS[variant]}
        stroke="hsl(var(--stamp) / 0.75)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </motion.svg>
  );
}
