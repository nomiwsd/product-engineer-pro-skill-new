"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const TECHNOLOGIES = [
  "Next.js 16 — App Router",
  "React 19+",
  "TypeScript Strict Mode",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Node.js — ESM",
  "Express.js",
  "NestJS",
  "PostgreSQL + Prisma",
  "MongoDB + Mongoose",
  "OWASP Top 10",
  "WCAG 2.2 AA",
  "Core Web Vitals",
  "Zod Validation",
  "Docker + CI/CD",
];

export function StackMarquee() {
  const prefersReduced = useReducedMotion();
  // Duplicate list to enable seamless loop (mask hides the seam)
  const doubled = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <section
      id="stack"
      className="py-10 bg-background-subtle border-y border-border relative overflow-hidden"
    >
      {/* Section label */}
      <div className="text-center mb-6">
        <p className="text-eyebrow text-muted-foreground">Supported Technology Stack</p>
      </div>

      {/* Gradient edge masks — fade to section background */}
      <div
        className="relative"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div
          className={cn(
            "flex items-center gap-5",
            !prefersReduced && "animate-marquee"
          )}
          style={prefersReduced ? { flexWrap: "wrap", justifyContent: "center", padding: "0 1.5rem" } : undefined}
        >
          {doubled.map((tech, i) => (
            <div
              key={`${tech}-${i}`}
              className={cn(
                "flex items-center gap-2.5 shrink-0 px-3.5 py-1.5",
                "rounded-full border border-border bg-card",
                "text-xs font-mono text-muted-foreground",
                "hover:border-border-strong hover:text-foreground",
                "transition-colors duration-150"
              )}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-primary shrink-0"
                aria-hidden="true"
              />
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
