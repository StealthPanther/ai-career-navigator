import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MarqueeProps {
  items: string[];
  className?: string;
  speed?: number;
  separator?: string;
}

/** An ink ticker tape that scrolls endlessly. Duplicates its content for a seamless loop. */
export default function Marquee({
  items,
  className,
  speed = 34,
  separator = "✦",
}: MarqueeProps) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 font-mono text-sm uppercase tracking-[0.3em] text-paper-2 whitespace-nowrap">
            {item}
          </span>
          <span className="text-stamp text-base" aria-hidden>
            {separator}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn(
        "marquee-paused relative overflow-hidden border-y border-ink/20 bg-ink py-3.5",
        className
      )}
    >
      <div
        className="marquee-track"
        style={{ ["--marquee-speed" as string]: `${speed}s` }}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
