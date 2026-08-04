"use client";

import * as React from "react";
import { ArrowRight, Github, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FinalCTA() {
  return (
    <section className="relative py-28 overflow-hidden bg-background-subtle">
      {/* === Background Layers === */}

      {/* 1. Noise grain texture */}
      <div className="absolute inset-0 bg-noise opacity-[0.8] pointer-events-none" />

      {/* 2. Layered radial glows — violet + amber, offset */}
      <div
        className="absolute top-1/2 left-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "600px",
          height: "400px",
          background: "radial-gradient(ellipse at center, var(--glow-color) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "400px",
          height: "300px",
          background: `radial-gradient(ellipse at center, oklch(0.80 0.17 38 / 0.15) 0%, transparent 70%)`,
          filter: "blur(60px)",
        }}
      />

      {/* 3. Top/bottom keylines */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
      />

      {/* === Content === */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary backdrop-blur-sm">
          <Terminal className="h-3.5 w-3.5" />
          <span className="text-eyebrow">Ready to Ship?</span>
        </div>

        <h2 className="text-display font-extrabold text-foreground text-balance">
          Stop debugging AI output.<br />
          Start <span className="text-gradient-brand">shipping</span>.
        </h2>

        <p className="text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
          One <code className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded border border-border text-primary">npx</code> command
          gives your AI coding agent principal-level engineering standards — permanently, not just for one conversation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button asChild size="xl" className="font-mono text-sm gap-2.5">
            <a href="#install">
              Install in 30 Seconds
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-mono text-sm gap-2">
            <a
              href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </a>
          </Button>
        </div>

        {/* Social proof */}
        <p className="text-eyebrow text-muted-foreground">
          MIT Licensed · Zero telemetry · Works with Claude, GPT, Gemini, Cursor, Windsurf
        </p>
      </div>
    </section>
  );
}
