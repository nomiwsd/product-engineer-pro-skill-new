"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ShieldAlert, Zap, Layers, GitCompare, Database, Accessibility,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Feature = {
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
  span: "1" | "2";
  accent?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: ShieldAlert,
    badge: "Security Baseline",
    title: "OWASP-Aligned Security By Default",
    description: "Enforces Zod schema validation, SQL injection prevention, CSRF token handling, and secure auth guard rails before writing any API endpoint. Not bolted-on — wired into every route handler template.",
    span: "2",
    accent: true,
  },
  {
    icon: Zap,
    badge: "Performance",
    title: "Core Web Vitals Awareness",
    description: "Eliminates CLS with explicit image dimensions, enforces dynamic imports for heavy dependencies, and optimizes font loading paths — LCP, INP, and CLS handled structurally.",
    span: "1",
  },
  {
    icon: Layers,
    badge: "Version-Adaptive",
    title: "Framework Version Detection",
    description: "Inspects your actual package.json before generating code. Detects Next.js 16 async params/cookies requiring await, React 19 hooks, and Tailwind v4 CSS-first syntax automatically.",
    span: "1",
  },
  {
    icon: GitCompare,
    badge: "Code Integrity",
    title: "Diff-First Minimal Changes",
    description: "Never rewrites files wholesale. Makes surgical, targeted diffs that preserve existing comments, API contracts, type interfaces, and naming conventions without touching unrelated code.",
    span: "1",
  },
  {
    icon: Database,
    badge: "Database Architecture",
    title: "PostgreSQL & MongoDB Decision Engine",
    description: "Evaluates data domain requirements to select the right database, then generates optimal schemas with explicit index placement, N+1 query prevention, and migration safety.",
    span: "2",
    accent: true,
  },
  {
    icon: Accessibility,
    badge: "A11y Verified",
    title: "WCAG 2.2 AA Baseline",
    description: "Enforces 4.5:1 contrast ratios, sequential keyboard tab order, complete ARIA attributes, and prefers-reduced-motion compliance on every UI component.",
    span: "1",
  },
];

export function Features() {
  const prefersReduced = useReducedMotion();

  const containerVars = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.08, delayChildren: prefersReduced ? 0 : 0.1 },
    },
  };

  const cardVars = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.45 } },
  };

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* ── Section background: subtle dot grid to differentiate from hero ── */}
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 bg-dot-grid opacity-50 [mask-image:radial-gradient(ellipse_100%_80%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="max-w-2xl mb-16 space-y-4">
          <p className="text-eyebrow text-primary">Capabilities & Standards</p>
          <h2 className="text-heading-xl text-foreground text-balance">
            Engineering rigor, not marketing promises
          </h2>
          <p className="text-body-lg text-muted-foreground text-balance">
            Concrete architectural rules, validation protocols, and security guards wired into your
            AI agent&apos;s reasoning loop — not generic "best practices" text.
          </p>
        </div>

        {/* ── Bento Grid ── */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVars}
                className={cn(
                  // Base card styles
                  "group relative flex flex-col rounded-2xl p-6 lg:p-8",
                  "bg-card border border-border card-highlight",
                  "transition-all duration-200",
                  // Hover: change border AND add glow
                  "hover:border-border-strong hover:shadow-card-hover",
                  // Span
                  feature.span === "2" ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                {/* Inner top shine — non-obvious detail */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent rounded-t-2xl" />

                {/* Header row */}
                <div className="flex items-start justify-between mb-5">
                  <div className={cn(
                    "h-11 w-11 rounded-xl flex items-center justify-center",
                    "border transition-all duration-200",
                    feature.accent
                      ? "bg-primary/10 border-primary/25 text-primary group-hover:bg-primary/20 group-hover:border-primary/40"
                      : "bg-muted border-border text-muted-foreground group-hover:border-border-strong group-hover:text-primary"
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-eyebrow text-muted-foreground px-2 py-1 rounded-md bg-muted border border-border">
                    {feature.badge}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className={cn(
                    "text-heading-md text-card-foreground",
                    "transition-colors duration-150 group-hover:text-primary"
                  )}>
                    {feature.title}
                  </h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Footer rule */}
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors duration-150" />
                  <span className="text-eyebrow text-muted-foreground">
                    Principal Engineering Standard
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
