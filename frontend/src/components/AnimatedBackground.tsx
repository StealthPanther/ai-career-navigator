'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* Paper base */}
      <div className="absolute inset-0 bg-gradient-to-br from-paper via-[#efe9d8] to-[#e9e2cf]" />

      {/* Warm amber wash — top left */}
      <div className="absolute -left-[10%] -top-[10%] h-[50vw] w-[50vw] rounded-full bg-gold/25 mix-blend-multiply blur-[120px] animate-pulse-slow" />

      {/* Seal blue wash — center/right */}
      <div className="absolute right-[10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-seal/15 mix-blend-multiply blur-[100px] animate-drift" />

      {/* Stamp red wash — bottom left */}
      <div className="absolute -left-[5%] bottom-0 h-[45vw] w-[45vw] rounded-full bg-stamp/10 mix-blend-multiply blur-[130px]" />

      {/* Fine dot grid, like graph paper */}
      <div className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(hsl(var(--ink)/0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
    </div>
  );
}
