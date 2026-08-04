"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Terminal, Copy, Check, Github, ArrowRight, ShieldCheck, Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    // Delay before typing starts for dramatic effect
    const startDelay = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        i++;
        setTyped(installCmd.slice(0, i));
        if (i >= installCmd.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, 38);
      return () => clearInterval(iv);
    }, 800);
    return () => clearTimeout(startDelay);
  }, [prefersReduced]);

  const copy = () => {
    navigator.clipboard.writeText(installCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={cn(
      "relative w-full max-w-2xl mx-auto rounded-2xl overflow-hidden",
      "border border-border bg-background",
      "shadow-card",
      // Subtle inner top highlight
      "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-border-strong before:to-transparent"
    )}>
      {/* Window chrome */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-background-subtle border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.60_0.22_25)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.19_70)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.66_0.18_148)]" />
          <span className="ml-2 text-eyebrow text-muted-foreground hidden xs:inline">bash — product-engineer-pro</span>
        </div>
        <span className="flex items-center gap-1.5 text-eyebrow text-muted-foreground">
          <Cpu className="h-3 w-3 text-primary" />
          v1.0.2
        </span>
      </div>

      {/* Command line — wraps vertically on very small screens */}
      <div className="px-4 sm:px-5 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-noise">
        <div className="flex items-center gap-3 font-mono text-[0.8125rem] sm:text-[0.875rem] min-w-0 overflow-hidden">
          {/* Prompt */}
          <span className="shrink-0 select-none text-primary font-bold">$</span>
          <span className="text-foreground truncate tracking-[-0.01em]">
            {typed}
            {!done && (
              <span className="inline-block w-[2px] h-[1em] ml-0.5 bg-accent align-text-bottom animate-pulse" />
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={copy}
          aria-label="Copy install command to clipboard"
          className={cn(
            "self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium",
            "border transition-all duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            copied
              ? "bg-success/10 border-success/30 text-success"
              : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-background-subtle"
          )}
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Post-command output — visible after typing completes */}
      {done && (
        <div className="px-5 pb-4 font-mono text-xs leading-relaxed border-t border-border/50 pt-3 bg-background-subtle/50">
          <div className="text-muted-foreground">
            <span className="text-success">✔</span>{" "}
            <span className="text-foreground">@nomiwsd/product-engineer-pro</span>{" "}
            <span className="text-muted-foreground">v1.0.2 installed for &quot;claude&quot;</span>
          </div>
          <div className="text-muted-foreground mt-1">
            <span className="opacity-60">  Skills:</span>{" "}
            <span className="text-primary">./.agents/skills/product-engineer-pro/</span>
          </div>
          <div className="text-muted-foreground">
            <span className="opacity-60">  Adapter:</span>{" "}
            <span className="text-primary">./CLAUDE.md</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function Hero() {
  const prefersReduced = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.085, delayChildren: prefersReduced ? 0 : 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.55 } },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 overflow-hidden bg-background">
      {/* === BACKGROUND LAYERS === */}

      {/* 1. Fine dot grid */}
      <div className="absolute inset-0 bg-dot-grid opacity-100 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,black_30%,transparent_100%)]" />

      {/* 2. Violet radial bloom behind headline */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: "800px",
          height: "500px",
          background: "radial-gradient(ellipse at center, var(--glow-color) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* 3. Subtle noise texture over glow area */}
      <div className="absolute inset-0 bg-noise opacity-[0.6] pointer-events-none" />

      {/* === CONTENT === */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center gap-7">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-7"
        >
          {/* EYEBROW BADGE */}
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 backdrop-blur-sm text-primary">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span className="text-eyebrow">Open Source · MIT Licensed · Portable Skill</span>
            </div>
          </motion.div>

          {/* HEADLINE */}
          <motion.div variants={item} className="max-w-4xl">
            <h1 className="text-display text-foreground">
              Turn any AI coding agent<br className="hidden sm:block" /> into a{" "}
              <span className="text-gradient-brand">principal-level</span> engineer
            </h1>
          </motion.div>

          {/* SUBHEADLINE */}
          <motion.div variants={item} className="max-w-2xl">
            <p className="text-body-lg text-muted-foreground text-balance">
              Production-grade standards for{" "}
              <strong className="text-foreground font-semibold">Next.js</strong>,{" "}
              <strong className="text-foreground font-semibold">React 19</strong>,{" "}
              <strong className="text-foreground font-semibold">TypeScript</strong>,{" "}
              <strong className="text-foreground font-semibold">Tailwind CSS v4</strong>,{" "}
              <strong className="text-foreground font-semibold">shadcn/ui</strong>,{" "}
              <strong className="text-foreground font-semibold">NestJS</strong>,{" "}
              <strong className="text-foreground font-semibold">PostgreSQL</strong>, and{" "}
              <strong className="text-foreground font-semibold">MongoDB</strong>{" "}
              — embedded directly in your agent&apos;s reasoning loop.
            </p>
          </motion.div>

          {/* CTA BUTTONS */}
          <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="font-mono text-sm gap-2.5">
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
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* TERMINAL BLOCK */}
          <motion.div variants={item} className="w-full pt-4">
            <TerminalBlock />
          </motion.div>

          {/* SOCIAL PROOF STRIP */}
          <motion.div variants={item}>
            <div className="flex items-center gap-6 text-eyebrow text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Terminal className="h-3 w-3 text-primary" />
                Works with Claude, GPT, Gemini, Cursor, Windsurf
              </span>
              <span className="hidden sm:block text-border">|</span>
              <span className="hidden sm:flex items-center gap-1.5">
                <ShieldCheck className="h-3 w-3 text-success" />
                Zero telemetry · Zero config
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
