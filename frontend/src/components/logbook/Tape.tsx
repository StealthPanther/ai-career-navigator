import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TapeProps {
  className?: string;
  style?: React.CSSProperties;
  angle?: number;
}

/**
 * A strip of sticky tape for pinning cards to the page.
 * Position it yourself via className (e.g. "-top-3 left-1/2 -translate-x-1/2").
 */
export default function Tape({ className, style, angle = -3 }: TapeProps) {
  return (
    <span
      aria-hidden
      className={cn("tape pointer-events-none z-20", className)}
      style={{ transform: `rotate(${angle}deg)`, ...style }}
    />
  );
}
