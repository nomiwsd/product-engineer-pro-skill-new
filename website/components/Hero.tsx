"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Terminal, Copy, Check, ArrowRight, ShieldCheck, Cpu, CheckCircle2, Zap, Layers,
} from "lucide-react";
import { SiGithub, SiClaude, SiCursor, SiWindsurf, SiNextdotjs, SiReact, SiTypescript } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { TiltCard } from "@/components/ui/tilt-card";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { cn } from "@/lib/utils";

function TerminalBlock() {
  const installCmd = "npx @nomiwsd/product-engineer-pro init";
  const [typed, setTyped] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => {
    if (prefersReduced) {
      setTyped(installCmd);
      setDone(true);
      return;
    }
    const startDelay = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped(installCmd.slice(0, i));
        if (i >= installCmd.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, 35);
      return () => clearInterval(iv);
    }, 600);
    return () => clearTimeout(startDelay);
  }, [prefersReduced]);

  const copy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full">
      {/* Window Chrome Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-background-subtle border-b border-border rounded-t-2xl">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-destructive/60 inline-block" />
          <span className="h-3 w-3 rounded-full bg-accent/60 inline-block" />
          <span className="h-3 w-3 rounded-full bg-success/60 inline-block" />
          <span className="ml-2 text-eyebrow text-muted-foreground hidden sm:inline">~/project/product-engineer-pro</span>
        </div>
        <div className="flex items-center gap-1.5 text-eyebrow text-muted-foreground font-mono">
          <Cpu className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>v1.0.2</span>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm space-y-3 bg-card/90 min-h-[210px] rounded-b-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-primary font-bold select-none shrink-0">$</span>
            <span className="text-foreground truncate tracking-tight">{typed}</span>
            {!done && (
              <span className="inline-block w-2 h-4 bg-accent align-middle animate-pulse shrink-0" />
            )}
          </div>
          <button
            type="button"
            onClick={copy}
            className={cn(
              "self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all shrink-0 cursor-pointer min-h-[36px]",
              copied
                ? "bg-success/10 border-success/30 text-success"
                : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
            )}
          >
            {copied ? <Check className="h-3.5 w-3.5 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>

        {done && (
          <div className="space-y-1.5 text-xs text-muted-foreground pt-1 animate-in fade-in duration-300 leading-relaxed">
            <p className="text-success flex items-center gap-2 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Skill deployed to workspace root
            </p>
            <div className="pl-5 space-y-0.5 text-foreground/80 font-mono">
              <p>• Next.js 16 (App Router) rules active</p>
              <p>• React 19 strict hooks baseline verified</p>
              <p>• OWASP Top 10 security guards active</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative min-h-[85vh] pt-28 sm:pt-36 pb-20 overflow-hidden bg-background">
      {/* ── PARALLAX BACKGROUND LAYERS ── */}
      <ParallaxLayer speed={-0.15} className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black_30%,transparent_100%)]" />
      </ParallaxLayer>

      <ParallaxLayer speed={0.2} className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div
          aria-hidden="true"
          className="w-[600px] sm:w-[800px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(ellipse at center, var(--glow-color) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </ParallaxLayer>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* ── LEFT COLUMN: Left-aligned fluid responsive copy & CTAs ── */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary backdrop-blur-md">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="text-eyebrow">Open Source · MIT Licensed Skill</span>
            </div>

            {/* Headline — Fluid Responsive Scale */}
            <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-[1.1]">
              Turn any AI coding agent into a{" "}
              <span className="text-gradient-brand">principal-level</span> engineer
            </h1>

            {/* Subheadline with max-width constraint on mobile */}
            <p className="text-base sm:text-lg text-muted-foreground text-balance max-w-xl leading-relaxed">
              Production-grade standards for{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                <SiNextdotjs className="h-3.5 w-3.5 text-foreground shrink-0" /> Next.js 16
              </span>,{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                <SiReact className="h-3.5 w-3.5 text-primary shrink-0" /> React 19
              </span>,{" "}
              <span className="inline-flex items-center gap-1 font-semibold text-foreground bg-muted px-2 py-0.5 rounded border border-border">
                <SiTypescript className="h-3.5 w-3.5 text-primary shrink-0" /> TypeScript
              </span>{" "}
              embedded directly in your agent&apos;s reasoning loop.
            </p>

            {/* CTA Buttons — Equal Heights & Baseline Alignment */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton asChild size="default" className="h-11 sm:h-12 px-5 sm:px-6 font-mono text-xs sm:text-sm rounded-xl inline-flex items-center gap-2">
                <a href="#install" className="inline-flex items-center gap-2">
                  <span>Install in 30 Seconds</span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </a>
              </MagneticButton>

              <Button asChild size="default" variant="outline" className="h-11 sm:h-12 px-5 sm:px-6 font-mono text-xs sm:text-sm rounded-xl inline-flex items-center gap-2">
                <a
                  href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <SiGithub className="h-4 w-4 text-foreground shrink-0" />
                  <span>Star on GitHub</span>
                </a>
              </Button>
            </div>

            {/* Agent compatibility strip */}
            <div className="pt-4 border-t border-border/60 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-muted-foreground font-mono">
              <span className="text-eyebrow text-muted-foreground">Compatible Agents:</span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-foreground font-medium" title="Claude / Anthropic">
                  <SiClaude className="h-4 w-4 text-primary shrink-0" /> Claude
                </span>
                <span className="flex items-center gap-1.5 text-foreground font-medium" title="Cursor AI">
                  <SiCursor className="h-4 w-4 text-foreground shrink-0" /> Cursor
                </span>
                <span className="flex items-center gap-1.5 text-foreground font-medium" title="Windsurf Cascade">
                  <SiWindsurf className="h-4 w-4 text-primary shrink-0" /> Windsurf
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Floating 3D terminal with 3 floating telemetry badges ── */}
          <div className="lg:col-span-6 relative mt-4 lg:mt-0">
            {/* Drifting Telemetry Floating Badge 1 (Top Right) */}
            <ParallaxLayer speed={-0.2} className="absolute -top-5 -right-2 z-20 hidden md:block">
              <motion.div
                initial={prefersReduced ? {} : { y: -8 }}
                animate={prefersReduced ? {} : { y: [ -5, 5, -5 ] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-success/40 bg-background/95 backdrop-blur-md shadow-card text-xs font-mono text-success"
              >
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span>OWASP Security Check: Passed</span>
              </motion.div>
            </ParallaxLayer>

            {/* Drifting Telemetry Floating Badge 2 (Bottom Left) */}
            <ParallaxLayer speed={0.3} className="absolute -bottom-6 -left-3 z-20 hidden md:block">
              <motion.div
                initial={prefersReduced ? {} : { y: 8 }}
                animate={prefersReduced ? {} : { y: [ 5, -5, 5 ] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-primary/40 bg-background/95 backdrop-blur-md shadow-card text-xs font-mono text-primary"
              >
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <span>TS Strict Baseline: 100%</span>
              </motion.div>
            </ParallaxLayer>

            {/* Drifting Telemetry Floating Badge 3 (Bottom Right) */}
            <ParallaxLayer speed={-0.15} className="absolute -bottom-8 right-4 z-20 hidden lg:block">
              <motion.div
                initial={prefersReduced ? {} : { y: -6 }}
                animate={prefersReduced ? {} : { y: [ -4, 4, -4 ] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-card text-xs font-mono text-foreground"
              >
                <Layers className="h-3.5 w-3.5 text-accent shrink-0" />
                <span>Next.js 16 App Router</span>
              </motion.div>
            </ParallaxLayer>

            {/* Floating 3D Tilt Card Terminal Container */}
            <TiltCard tiltDegree={8} className="p-0 overflow-hidden shadow-card-hover border-border-strong rounded-2xl bg-card">
              <TerminalBlock />
            </TiltCard>
          </div>

        </div>
      </div>
    </section>
  );
}
