import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChapterLabelProps {
  index: string;
  title: string;
  className?: string;
  dark?: boolean;
}

/** Editorial chapter marker — "CH. 01 — THE DOSSIER" with a trailing rule. */
export default function ChapterLabel({
  index,
  title,
  className,
  dark = false,
}: ChapterLabelProps) {
  return (
    <div
      className={cn(
        "chapter-label",
        dark && "[&::after]:bg-paper-2/40",
        className
      )}
    >
      <span className={cn(dark ? "text-stamp" : "text-stamp")}>
        CH. {index}
      </span>
      <span className={cn(dark ? "text-paper-2" : "text-ink-2")}>{title}</span>
    </div>
  );
}
