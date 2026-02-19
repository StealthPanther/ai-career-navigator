'use client';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0F0A1F]">
      {/* Deep Violet Base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a103c] via-[#0F0A1F] to-[#0a0510]" />

      {/* Gold/Peach Orb - Top Left */}
      <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] bg-[#FFB088] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse-slow" />

      {/* Purple/Blue Orb - Center/Right */}
      <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] bg-[#7c3aed] rounded-full mix-blend-screen filter blur-[100px] opacity-15 animate-float-slow" />

      {/* Pink/Rose Orb - Bottom Left */}
      <div className="absolute bottom-0 -left-[5%] w-[45vw] h-[45vw] bg-[#db2777] rounded-full mix-blend-screen filter blur-[130px] opacity-10" />

      {/* Subtle Noise Texture for premium feel */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
