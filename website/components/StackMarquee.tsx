"use client";

import * as React from "react";
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiExpress, SiNestjs, SiPostgresql, SiMongodb, SiGithub,
  SiClaude, SiCursor, SiWindsurf, SiGithubcopilot,
} from "react-icons/si";
import { MarqueeWall } from "@/components/ui/marquee-wall";

const ROW_1_LOGOS = [
  { name: "Next.js 16", icon: SiNextdotjs },
  { name: "React 19", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Tailwind v4", icon: SiTailwindcss },
  { name: "Node.js ESM", icon: SiNodedotjs },
  { name: "Express.js", icon: SiExpress },
  { name: "NestJS", icon: SiNestjs },
];

const ROW_2_LOGOS = [
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "GitHub Copilot", icon: SiGithubcopilot },
  { name: "Claude Code", icon: SiClaude },
  { name: "Cursor AI", icon: SiCursor },
  { name: "Windsurf", icon: SiWindsurf },
  { name: "GitHub Actions", icon: SiGithub },
];

export function StackMarquee() {
  return (
    <section
      id="stack"
      className="py-16 bg-background-subtle border-y border-border relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
        <p className="text-eyebrow text-muted-foreground tracking-widest">
          Supported Technology Stack &amp; AI Agents
        </p>
      </div>

      <MarqueeWall row1={ROW_1_LOGOS} row2={ROW_2_LOGOS} />
    </section>
  );
}
