import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Logbook palette */
        paper: "hsl(var(--paper))",
        "paper-2": "hsl(var(--paper-2))",
        ink: "hsl(var(--ink))",
        "ink-2": "hsl(var(--ink-2))",
        stamp: "hsl(var(--stamp))",
        seal: "hsl(var(--seal))",
        plum: "hsl(var(--plum))",
        gold: "hsl(var(--gold))",
        line: "hsl(var(--line))",
        /* Legacy names */
        "neural-blue": "hsl(var(--neural-blue))",
        "synapse-purple": "hsl(var(--synapse-purple))",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        hard: "3px 3px 0 0 hsl(var(--ink))",
        "hard-sm": "2px 2px 0 0 hsl(var(--ink))",
        "hard-paper": "3px 3px 0 0 hsl(var(--paper))",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient": "gradient 8s linear infinite",
        "marquee": "marquee var(--marquee-speed, 32s) linear infinite",
        "stamp-in": "stampIn 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.25) both",
        "blink": "blink 1.1s step-end infinite",
        "drift": "drift 16s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        stampIn: {
          "0%": { opacity: "0", transform: "rotate(-14deg) scale(1.6)" },
          "60%": { opacity: "0.95", transform: "rotate(-3deg) scale(0.96)" },
          "100%": { opacity: "0.88", transform: "rotate(-5deg) scale(1)" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        drift: {
          "0%, 100%": { transform: "translate(0, 0) rotate(var(--drift-rot, 0deg))" },
          "33%": { transform: "translate(12px, -16px) rotate(calc(var(--drift-rot, 0deg) + 3deg))" },
          "66%": { transform: "translate(-10px, 10px) rotate(calc(var(--drift-rot, 0deg) - 3deg))" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
