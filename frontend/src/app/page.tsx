"use client";

import React from "react";
import Hero from "@/components/Hero";
import StickyJourney from "@/components/StickyJourney";
import TechOrbit from "@/components/TechOrbit";
import { Github, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-synapse-purple/30 selection:text-white relative font-sans">
      {/* Global Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neural-blue to-synapse-purple flex items-center justify-center p-1">
            <span className="w-full h-full rounded-md border border-white/30" />
          </div>
          <span className="font-bold text-lg tracking-tight">AI Career Navigator</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/StealthPanther/ai-career-navigator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-colors text-sm font-medium border-white/20"
          >
            <Github className="w-4 h-4" />
            <span>Star on GitHub</span>
          </a>
        </div>
      </nav>

      <Hero />
      <StickyJourney />

      <TechOrbit />

      {/* Footer CTA & Links */}
      <footer className="relative border-t border-white/10 pt-20 pb-10 overflow-hidden">
        <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-neural-blue/50 to-transparent" />
        <div className="container px-4 mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-neural-blue to-synapse-purple flex items-center justify-center p-0.5">
                <span className="w-full h-full rounded-[3px] border border-white/30" />
              </div>
              <span className="font-bold tracking-tight">AI Career Navigator</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              The most advanced AI career navigation system. Built with Next.js 14, Framer Motion, and Tailwind CSS. Open source and ready to deploy.
            </p>
            <a
              href="https://github.com/StealthPanther/ai-career-navigator"
              className="inline-flex items-center gap-2 text-sm text-white hover:text-neural-blue transition-colors font-medium border-b border-transparent hover:border-neural-blue pb-1"
            >
              <Star className="w-4 h-4" /> Drop a star on GitHub
            </a>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="https://github.com/StealthPanther/ai-career-navigator#readme" target="_blank" rel="noopener noreferrer" className="hover:text-neural-blue transition-colors">Documentation</a></li>
              <li><a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" className="hover:text-neural-blue transition-colors">API Reference</a></li>
              <li><a href="https://github.com/StealthPanther/ai-career-navigator/discussions" target="_blank" rel="noopener noreferrer" className="hover:text-neural-blue transition-colors">Community</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white/90">Connect</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-synapse-purple transition-colors">X (Twitter)</a></li>
              <li><a href="#" className="hover:text-synapse-purple transition-colors">Discord</a></li>
              <li><a href="#" className="hover:text-synapse-purple transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="container px-4 mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground/50 pt-8 border-t border-white/5">
          <p>© {new Date().getFullYear()} AI Career Navigator. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
