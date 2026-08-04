"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import {
  Search, Code2, ShieldAlert, Database, CheckCircle2, ChevronRight, ChevronLeft,
} from "lucide-react";
import { SiPostgresql } from "react-icons/si";
import { cn } from "@/lib/utils";

type Mode = {
  id: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  description: string;
  checks: string[];
  stats: { label: string; value: string }[];
  fileName: string;
  borderAccentClass: string;
  output: string;
  brandIcon?: React.ElementType;
};

const MODES: Mode[] = [
  {
    id: "audit",
    name: "Audit",
    icon: Search,
    badge: "Diagnostic Mode",
    headline: "Full-Stack Codebase Health Audit",
    description: "Inspects architecture, flags legacy Next.js API usage, detects unindexed database queries, and validates error boundary coverage before writing code.",
    checks: ["Next 16 async params & cookies check", "API route error boundary coverage", "Unindexed database query detection"],
    stats: [
      { label: "Avg Findings", value: "3-8 Issues" },
      { label: "Scan Speed", value: "~0.8s" },
      { label: "Scope", value: "Full Src" },
    ],
    fileName: "audit-report.log",
    borderAccentClass: "border-l-primary",
    output: ` 1 | [AUDIT] Scanning workspace /src ...
 2 | ✔ Next.js version detected: 16.3.0 (App Router)
 3 | ⚠ WARN  app/api/users/route.ts:14
 4 |         Missing \`await\` on cookies() — required in Next.js 16
 5 | ⚠ WARN  components/UserProfile.tsx:42
 6 |         Missing \`key\` prop on list item render
 7 | ✖ ERROR lib/db/queries.ts:88
 8 |         Unindexed SELECT on high-cardinality column user.email
 9 |         Recommendation: CREATE INDEX idx_users_email ON users(email)
10 | ────────────────────────────────────────────────────────
11 | Status: Scan complete — 1 Critical · 2 Warnings · 0 Security Blockers`,
  },
  {
    id: "implement",
    name: "Implement",
    icon: Code2,
    badge: "Execution Mode",
    headline: "Surgical Feature Implementation",
    description: "Applies minimal, diff-first additions that respect your existing component design system, type interfaces, and naming conventions.",
    checks: ["Zod schema verification against TS types", "Semantic CSS token adherence (0 hardcoded hex)", "Co-located unit test assertion generation"],
    stats: [
      { label: "Diff Limit", value: "≤ 150 Lines" },
      { label: "Build Pass", value: "100%" },
      { label: "Scope", value: "Target File" },
    ],
    fileName: "implementation.patch",
    borderAccentClass: "border-l-primary",
    output: ` 1 | [IMPLEMENT] Target: app/dashboard/page.tsx
 2 | + export async function DashboardPage() {
 3 | +   const session = await auth();
 4 | +   if (!session) redirect("/login");
 5 | +
 6 | +   return <DashboardClient user={session.user} />;
 7 | + }
 8 |
 9 | ✔ Types updated: lib/types/auth.ts → Added: DashboardUser
10 | ✔ Zod schema verified: DashboardUserSchema
11 | ────────────────────────────────────────────────────────
12 | Status: Diff applied cleanly — 0 TS errors · 0 lint warnings`,
  },
  {
    id: "security",
    name: "Security",
    icon: ShieldAlert,
    badge: "OWASP Hardening",
    headline: "Security Vulnerability Scan & Remediation",
    description: "Automated OWASP Top 10 analysis with auto-remediation. Enforces Zod validation, rate limiting, CSRF tokens, and strict SameSite cookies.",
    checks: ["Zod validation on request body", "CSRF & SameSite=Lax/Strict policy", "NoSQL / SQL injection prevention"],
    stats: [
      { label: "OWASP Coverage", value: "Top 10" },
      { label: "Auto-Fix", value: "Enabled" },
      { label: "Severity", value: "High / Med" },
    ],
    fileName: "security-report.json",
    borderAccentClass: "border-l-destructive",
    output: ` 1 | {
 2 |   "scan_target": "POST /api/checkout",
 3 |   "findings": [
 4 |     { "rule": "SEC-004", "severity": "HIGH",
 5 |       "file": "app/api/checkout/route.ts:22",
 6 |       "issue": "Unvalidated JSON body → db.create()",
 7 |       "fix": "CheckoutSchema.parseAsync(body)" },
 8 |     { "rule": "SEC-011", "severity": "MEDIUM",
 9 |       "file": "middleware.ts:8",
10 |       "issue": "No rate limit on auth endpoints",
11 |       "fix": "ratelimit(10, '1m') middleware" }
12 |   ],
13 |   "status": "REMEDIATION_APPLIED"
14 | }`,
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    badge: "Schema & Queries",
    headline: "PostgreSQL & MongoDB Optimization",
    description: "Designs relational schemas or document collections with compound indexes, cascade rules, migration safety, and N+1 query elimination.",
    checks: ["Prisma/Drizzle compound index schema", "Mongoose typed document schema", "EXPLAIN ANALYZE performance audit"],
    stats: [
      { label: "Query Speed", value: "420ms → 1.4ms" },
      { label: "Index Lock", value: "Safe CONCURRENTLY" },
      { label: "ORMs", value: "Prisma / Mongoose" },
    ],
    fileName: "migration.sql",
    borderAccentClass: "border-l-accent",
    brandIcon: SiPostgresql,
    output: ` 1 | -- PostgreSQL Migration: Add Compound Index
 2 | -- Safe for production: CONCURRENTLY avoids table lock
 3 |
 4 | CREATE UNIQUE INDEX CONCURRENTLY
 5 |   idx_users_org_email ON users (organization_id, email);
 6 |
 7 | ALTER TABLE audit_logs
 8 |   ADD CONSTRAINT fk_audit_user
 9 |   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
10 |
11 | -- EXPLAIN ANALYZE: Before 420ms (Seq Scan) → After 1.4ms (Index Scan)
12 | ────────────────────────────────────────────────────────
13 | Status: Migration generated safely — 0 locking queries`,
  },
  {
    id: "review",
    name: "Review",
    icon: CheckCircle2,
    badge: "PR Inspector",
    headline: "Principal-Level Code Review",
    description: "Pre-merge review enforcing design system adherence, bundle impact analysis, accessibility validation, and type safety.",
    checks: ["Zero hardcoded color hex values", "WCAG 2.2 AA contrast verification", "Public API breaking change guard"],
    stats: [
      { label: "Score", value: "97 / 100" },
      { label: "Bundle Impact", value: "+2.1KB gzip" },
      { label: "Merge State", value: "Ready" },
    ],
    fileName: "pr-review.md",
    borderAccentClass: "border-l-success",
    output: ` 1 | ## Code Review Summary: PASS (97/100)
 2 |
 3 | ✔ Security       OWASP Top 10 — no new vulnerabilities
 4 | ✔ Accessibility  WCAG 2.2 AA contrast verified
 5 | ✔ Performance    Bundle impact: +2.1KB gzip (within threshold)
 6 | ✔ Design System  0 hardcoded colors — 100% semantic tokens
 7 | ✔ Types          0 TypeScript errors · 0 \`any\` casts
 8 | ⚠ Note           UserCard hover state missing focus ring
 9 |                  → Added \`focus-visible:ring-2\` before merge
10 | ────────────────────────────────────────────────────────
11 | Status: Ready for production merge`,
  },
];

const SLIDE_OFFSET_PX = 300;
const SIDE_ROTATE_DEG = 26;
const SIDE_SCALE = 0.85;
const SIDE_TRANSLATE_Z = -140;

function getSlideStyle(position: number): React.CSSProperties {
  if (position === 0) {
    return {
      transform: "translateX(0px) rotateY(0deg) translateZ(0px) scale(1)",
      opacity: 1,
      zIndex: 30,
      pointerEvents: "auto",
    };
  }
  if (position === -1 || position === 1) {
    const dir = position === -1 ? -1 : 1;
    return {
      transform: `translateX(${dir * SLIDE_OFFSET_PX}px) rotateY(${-dir * SIDE_ROTATE_DEG}deg) translateZ(${SIDE_TRANSLATE_Z}px) scale(${SIDE_SCALE})`,
      opacity: 0.5,
      zIndex: 20,
      pointerEvents: "auto",
    };
  }
  const dir = position < 0 ? -1 : 1;
  return {
    transform: `translateX(${dir * SLIDE_OFFSET_PX * 1.6}px) translateZ(-400px) scale(0.6)`,
    opacity: 0,
    zIndex: 0,
    pointerEvents: "none",
  };
}

export function ModesShowcase() {
  const [activeIndex, setActiveIndex] = React.useState(2); // Security default
  const prefersReduced = useReducedMotion();

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : MODES.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < MODES.length - 1 ? prev + 1 : 0));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "ArrowRight") handleNext();
  };

  return (
    <section id="modes" className="relative py-24 overflow-hidden bg-background">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <p className="text-eyebrow text-accent">Operating Modes — 3D Coverflow</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">
            Specialized workflows, invoked on demand
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance">
            Click any slide or use controls to navigate the 3D coverflow showcase.
          </p>
        </div>

        {/* Synced Mode Navigation Pills — Smooth Mobile Touch Scroll */}
        <div className="w-full max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none mb-8 sm:mb-10">
          <div
            role="tablist"
            aria-label="Operating mode selector"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex items-center justify-start sm:justify-center gap-2 min-w-max pb-2 pt-1 focus-visible:outline-none"
          >
            {MODES.map((mode, idx) => {
              const Icon = mode.icon;
              const isActive = activeIndex === idx;
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  id={`tab-mode-${mode.id}`}
                  aria-selected={isActive}
                  aria-controls={`panel-mode-${mode.id}`}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "relative flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl text-xs font-mono font-medium",
                    "border transition-all duration-200 cursor-pointer shrink-0 min-h-[44px]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-glow font-bold scale-105"
                      : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border-strong hover:bg-background-subtle"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">{mode.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/*
          Coverflow perspective & overflow-hidden ONLY apply at lg+.
          Below lg, this is just a normal stacking container — no 3D
          transforms are computed or applied at all (see getSlideStyle
          usage below, gated by prefersReduced OR mobile check isn't
          needed because absolute positioning itself is lg:-scoped).
        */}
        <div className="relative max-w-5xl mx-auto lg:[perspective:1500px] lg:overflow-hidden rounded-2xl">
          {/* Desktop arrow buttons */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous mode"
            className="hidden lg:flex absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors cursor-pointer shadow-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next mode"
            className="hidden lg:flex absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong transition-colors cursor-pointer shadow-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Mobile/tablet: compact prev/next row above the single visible card */}
          <div className="flex lg:hidden items-center justify-between mb-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous mode"
              className="h-11 w-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-eyebrow text-muted-foreground">Mode {activeIndex + 1} of {MODES.length}</span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next mode"
              className="h-11 w-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/*
            h-auto below lg (content determines height naturally, no clipping),
            fixed h-[560px] only at lg+ where absolute-positioned coverflow
            slides require a defined container height.
          */}
          <div className="relative w-full h-auto lg:h-[560px] lg:[transform-style:preserve-3d]">
            {MODES.map((mode, idx) => {
              const isActive = activeIndex === idx;
              let position = idx - activeIndex;
              if (position < -2) position += MODES.length;
              if (position > 2) position -= MODES.length;

              // Below lg: only the active slide renders in normal document
              // flow (no absolute positioning, no transforms at all).
              const mobileVisibilityClass = isActive ? "block" : "hidden lg:block";

              const style: React.CSSProperties = prefersReduced
                ? { opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }
                : { ...getSlideStyle(position), transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease" };

              return (
                <div
                  key={mode.id}
                  id={`panel-mode-${mode.id}`}
                  role="tabpanel"
                  aria-labelledby={`tab-mode-${mode.id}`}
                  onClick={() => !isActive && setActiveIndex(idx)}
                  style={{ ...style, transformStyle: "preserve-3d" }}
                  className={cn(
                    "rounded-2xl border border-border bg-card shadow-card overflow-hidden min-w-0",
                    "relative lg:absolute lg:inset-0 h-auto lg:h-full mb-4 lg:mb-0",
                    mobileVisibilityClass,
                    !isActive && "cursor-pointer"
                  )}
                >
                  <ModeSlideContent mode={mode} idx={idx} />
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function ModeSlideContent({ mode, idx }: { mode: Mode; idx: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border h-full min-w-0">
      {/* Left Column */}
      <div className="lg:col-span-2 p-6 lg:p-7 space-y-5 flex flex-col justify-between overflow-y-auto min-w-0">
        <div className="space-y-3 min-w-0">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <span className="text-eyebrow text-accent px-2.5 py-1 rounded-md bg-muted border border-border whitespace-nowrap">
              {mode.badge}
            </span>
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
              <mode.icon className="h-4 w-4 shrink-0" />
            </div>
          </div>

          <div className="min-w-0">
            <h3 className="text-lg font-bold text-card-foreground break-words">{mode.headline}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 break-words">
              {mode.description}
            </p>
          </div>

          <div className="space-y-1.5 pt-2 min-w-0">
            <p className="text-eyebrow text-muted-foreground">What It Checks:</p>
            {mode.checks.map((check) => (
              <div key={check} className="flex items-start gap-2 text-xs font-mono text-foreground/90 min-w-0">
                <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="break-words">{check}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-border grid grid-cols-3 gap-2 text-center min-w-0">
          {mode.stats.map((stat) => (
            <div key={stat.label} className="p-2 rounded-lg bg-background border border-border min-w-0">
              <p className="text-[0.65rem] text-muted-foreground font-mono uppercase truncate">{stat.label}</p>
              <p className="text-xs font-bold text-foreground font-mono mt-0.5 truncate">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Code Panel */}
      <div className={cn("lg:col-span-3 bg-background p-5 border-l-4 flex flex-col min-h-0 min-w-0", mode.borderAccentClass)}>
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border text-xs font-mono text-muted-foreground shrink-0 min-w-0">
          <span className="flex items-center gap-2 font-semibold min-w-0">
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            <span className="truncate">{mode.fileName}</span>
          </span>
          <span className="text-eyebrow whitespace-nowrap shrink-0">Mode {idx + 1} of 5</span>
        </div>

        <pre className="my-2 p-4 rounded-xl bg-noise border border-border text-xs font-mono leading-relaxed overflow-auto text-foreground/90 tabular-nums max-h-[300px] flex-1 min-w-0">
          <code>{mode.output}</code>
        </pre>

        <div className="pt-2 border-t border-border flex items-center justify-between gap-2 text-eyebrow text-muted-foreground shrink-0">
          <span>Terminal Output</span>
          <span className="text-success font-mono font-bold">100% Enforced</span>
        </div>
      </div>
    </div>
  );
}