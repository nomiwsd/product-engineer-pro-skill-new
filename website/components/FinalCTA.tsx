"use client";

import * as React from "react";
import { ArrowRight, Terminal } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ParallaxLayer } from "@/components/ui/parallax-layer";

export function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden bg-background-subtle border-t border-border">
      {/* ── PARALLAX ANIMATED GLOW ORBS ── */}
      <ParallaxLayer speed={-0.3} className="absolute top-1/2 left-[35%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          aria-hidden="true"
          className="w-[450px] sm:w-[600px] h-[350px] rounded-full opacity-70"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-color) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </ParallaxLayer>

      <ParallaxLayer speed={0.4} className="absolute top-1/2 left-[65%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          aria-hidden="true"
          className="w-[400px] sm:w-[500px] h-[300px] rounded-full opacity-60"
          style={{
            background: `radial-gradient(ellipse at center, oklch(0.80 0.17 38 / 0.20) 0%, transparent 70%)`,
            filter: "blur(70px)",
          }}
        />
      </ParallaxLayer>

      {/* Noise Grain Background */}
      <div className="absolute inset-0 bg-noise opacity-80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary backdrop-blur-md">
          <Terminal className="h-3.5 w-3.5 shrink-0" />
          <span className="text-eyebrow">Ready to Ship?</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1] text-balance">
          Stop debugging AI output.<br />
          Start <span className="text-gradient-brand">shipping</span>.
        </h2>

        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto text-balance">
          One <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded border border-border text-primary font-semibold">npx</code> command
          gives your AI coding agent principal-level engineering standards — permanently.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {/* Magnetic primary CTA button */}
          <MagneticButton asChild size="lg" className="h-12 sm:h-14 px-6 sm:px-8 font-mono text-xs sm:text-sm rounded-xl shadow-glow inline-flex items-center gap-2.5">
            <a href="#install" className="inline-flex items-center gap-2.5">
              <span>Install in 30 Seconds</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </a>
          </MagneticButton>

          <Button asChild size="lg" variant="outline" className="h-12 sm:h-14 px-6 sm:px-8 font-mono text-xs sm:text-sm rounded-xl inline-flex items-center gap-2.5">
            <a
              href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5"
            >
              <SiGithub className="h-4 w-4 text-foreground shrink-0" />
              <span>Star on GitHub</span>
            </a>
          </Button>
        </div>

        <p className="text-eyebrow text-muted-foreground pt-3">
          MIT Licensed · Zero Telemetry · Works with Claude, GPT, Gemini, Cursor, Windsurf
        </p>
      </div>
    </section>
  );
}
