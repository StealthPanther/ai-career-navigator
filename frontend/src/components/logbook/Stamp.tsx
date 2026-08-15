"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tone = "red" | "ink" | "blue" | "gold";

const toneClass: Record<Tone, string> = {
  red: "stamp-red",
  ink: "stamp-ink",
  blue: "stamp-blue",
  gold: "stamp-gold",
};

interface StampProps {
  children: React.ReactNode;
  tone?: Tone;
  flat?: boolean;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** A rubber stamp — dashed-free bordered mono text with ink-bleed texture. */
export default function Stamp({
  children,
  tone = "red",
  flat = false,
  animate = false,
  className,
  style,
}: StampProps) {
  return (
    <span
      className={cn(
        "stamp",
        toneClass[tone],
        flat && "stamp-flat",
        animate && "stamp-in",
        className
      )}
      style={style}
    >
      {children}
    </span>
  );
}
