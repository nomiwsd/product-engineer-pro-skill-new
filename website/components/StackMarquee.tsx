"use client";

import * as React from "react";
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiExpress, SiNestjs, SiPostgresql, SiMongodb, SiGithub,
  SiClaude, SiCursor, SiWindsurf, SiGithubcopilot,
} from "react-icons/si";
import { MarqueeWall } from "@/components/ui/marquee-wall";

const ROW_1_LOGOS = [
  { name: "Next.js 16",  icon: SiNextdotjs,  color: "#ffffff" },
  { name: "React 19",    icon: SiReact,       color: "#61DAFB" },
  { name: "TypeScript",  icon: SiTypescript,  color: "#3178C6" },
  { name: "Tailwind v4", icon: SiTailwindcss, color: "#06B6D4" },
  { name: "Node.js ESM", icon: SiNodedotjs,   color: "#339933" },
  { name: "Express.js",  icon: SiExpress,     color: "#ffffff" },
  { name: "NestJS",      icon: SiNestjs,      color: "#E0234E" },
];

const ROW_2_LOGOS = [
  { name: "PostgreSQL",     icon: SiPostgresql,    color: "#4169E1" },
  { name: "MongoDB",        icon: SiMongodb,       color: "#47A248" },
  { name: "GitHub Copilot", icon: SiGithubcopilot, color: "#ffffff" },
  { name: "Claude Code",    icon: SiClaude,        color: "#CC785C" },
  { name: "Cursor AI",      icon: SiCursor,        color: "#ffffff" },
  { name: "Windsurf",       icon: SiWindsurf,      color: "#00C7B7" },
  { name: "GitHub Actions", icon: SiGithub,        color: "#ffffff" },
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
