"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Search, Code2, ShieldAlert, Database, CheckCircle2, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = {
  id: string;
  name: string;
  icon: React.ElementType;
  badge: string;
  headline: string;
  description: string;
  bullets: string[];
  fileName: string;
  output: string;
};

const MODES: Mode[] = [
  {
    id: "audit",
    name: "Audit",
    icon: Search,
    badge: "Diagnostic Mode",
    headline: "Full-Stack Codebase Health Audit",
    description:
      "Inspects architecture, flags legacy Next.js API usage, detects unindexed database queries, and validates error boundary coverage before any new code is written.",
    bullets: [
      "Detects missing await on Next.js 16 dynamic parameters",
      "Validates API route error boundaries & response status codes",
      "Flags unhandled promise rejections and missing suspense fallbacks",
    ],
    fileName: "audit-report.log",
    output: `[AUDIT] Scanning workspace /src ...
✔ Next.js version detected: 16.3.0 (App Router)
⚠ WARN  app/api/users/route.ts:14
        Missing \`await\` on cookies() — required in Next.js 16
⚠ WARN  components/UserProfile.tsx:42
        Missing \`key\` prop on list item render
✖ ERROR lib/db/queries.ts:88
        Unindexed SELECT on high-cardinality column user.email
        Recommendation: CREATE INDEX idx_users_email ON users(email)
──────────────────────────────────────────
Summary: 1 Critical · 2 Warnings · 0 Security Blockers`,
  },
  {
    id: "implement",
    name: "Implement",
    icon: Code2,
    badge: "Execution Mode",
    headline: "Surgical Feature Implementation",
    description:
      "Applies minimal, diff-first additions that respect your existing component design system, type interfaces, and naming conventions. Never rewrites files not in scope.",
    bullets: [
      "Generates TypeScript interfaces verified against Zod schema",
      "Reuses existing design tokens — no hardcoded hex values added",
      "Generates co-located test assertions for critical code paths",
    ],
    fileName: "implementation.patch",
    output: `[IMPLEMENT] Target: app/dashboard/page.tsx
+ export async function DashboardPage() {
+   const session = await auth();
+   if (!session) redirect("/login");
+
+   return <DashboardClient user={session.user} />;
+ }

✔ Types updated: lib/types/auth.ts
  → Added: DashboardUser extends BaseUser
✔ Zod schema verified: DashboardUser
✔ Build check: 0 TS errors · 0 lint warnings`,
  },
  {
    id: "security",
    name: "Security",
    icon: ShieldAlert,
    badge: "OWASP Hardening",
    headline: "Security Vulnerability Scan & Remediation",
    description:
      "Automated OWASP Top 10 analysis with auto-remediation. Enforces Zod validation, rate limiting, CSRF tokens, and strict SameSite cookie policies on every API endpoint.",
    bullets: [
      "Verifies Zod schema validation on every incoming request body",
      "Ensures CSRF protection & strict SameSite=Lax/Strict cookie policy",
      "Prevents NoSQL injection in MongoDB filter objects",
    ],
    fileName: "security-report.json",
    output: `{
  "scan_target": "POST /api/checkout",
  "findings": [
    {
      "rule_id": "SEC-004",
      "severity": "HIGH",
      "file": "app/api/checkout/route.ts:22",
      "issue": "Unvalidated JSON body passed to db.create()",
      "fix": "Wrap with CheckoutSchema.parseAsync(body)"
    },
    {
      "rule_id": "SEC-011",
      "severity": "MEDIUM",
      "file": "middleware.ts:8",
      "issue": "No rate limit on authenticated endpoints",
      "fix": "Apply ratelimit(10, '1m') middleware"
    }
  ],
  "status": "REMEDIATION_APPLIED"
}`,
  },
  {
    id: "database",
    name: "Database",
    icon: Database,
    badge: "Schema & Queries",
    headline: "PostgreSQL & MongoDB Optimization",
    description:
      "Designs relational schemas or document collections with compound indexes, cascade rules, migration safety, and N+1 query elimination — not just raw SQL generation.",
    bullets: [
      "Prisma/Drizzle schema with compound indexes and migration rollback",
      "Mongoose schema with lean queries and typed filter objects",
      "EXPLAIN ANALYZE output comparison before/after optimization",
    ],
    fileName: "migration.sql",
    output: `-- PostgreSQL Migration: Add Compound Index
-- Safe for production: CONCURRENTLY avoids table lock

CREATE UNIQUE INDEX CONCURRENTLY
  idx_users_org_email ON users (organization_id, email);

ALTER TABLE audit_logs
  ADD CONSTRAINT fk_audit_user
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- EXPLAIN ANALYZE comparison:
--   Before: Seq Scan · cost=0.00..842.00 · actual=420ms
--   After:  Index Scan · cost=0.43..8.45 · actual=1.4ms`,
  },
  {
    id: "review",
    name: "Review",
    icon: CheckCircle2,
    badge: "PR Inspector",
    headline: "Principal-Level Code Review",
    description:
      "Pre-merge review enforcing design system adherence, bundle impact analysis, accessibility validation, and type safety — surfacing conflicts rather than silently deferring.",
    bullets: [
      "Verifies zero hardcoded color hex values in new/modified components",
      "Validates WCAG AA contrast on all new text/bg pairings",
      "Ensures no breaking changes to exported public API surface",
    ],
    fileName: "pr-review.md",
    output: `## Code Review Summary: PASS (97/100)

✔ Security     OWASP Top 10 — no new vulnerabilities introduced
✔ Accessibility  WCAG 2.2 AA contrast verified on all changed components
✔ Performance  Bundle impact: +2.1KB gzip (within 5KB threshold)
✔ Design System  0 hardcoded colors — 100% semantic token usage
✔ Types        0 TypeScript errors · 0 \`any\` casts added
⚠ Note        UserCard hover state missing focus-visible ring
              → Added \`focus-visible:ring-2\` before merge

Status: ✅ Ready for production merge`,
  },
];

export function ModesShowcase() {
  const prefersReduced = useReducedMotion();
  const [active, setActive] = React.useState("security");
  const current = MODES.find((m) => m.id === active) ?? MODES[0];

  return (
    <section
      id="modes"
      className="relative py-24 overflow-hidden"
    >
      {/* ── Background: full-bleed bordered panel feel, different from Features ── */}
      <div className="absolute inset-0 bg-background-subtle" />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--border-strong), transparent)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(to right, transparent, var(--border), transparent)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <p className="text-eyebrow text-accent">Operating Modes</p>
          <h2 className="text-heading-xl text-foreground text-balance">
            Specialized workflows, invoked on demand
          </h2>
          <p className="text-body-lg text-muted-foreground text-balance">
            Switch your AI coding agent&apos;s focus between diagnosing, implementing, hardening, and reviewing
            — each mode applies a distinct constraint set.
          </p>
        </div>

        {/* ── Tab Bar — horizontal scroll on mobile ── */}
        <div
          role="tablist"
          aria-label="Operating mode selector"
          className="flex items-center gap-2 mb-10 overflow-x-auto pb-1 scrollbar-none -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const isActive = active === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                role="tab"
                id={`tab-${mode.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${mode.id}`}
                onClick={() => setActive(mode.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-medium",
                  "border transition-all duration-150 cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-subtle",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border-strong hover:bg-background"
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {mode.name}
              </button>
            );
          })}
        </div>

        {/* ── Content Panel ── */}
        <div
          className={cn(
            "relative rounded-2xl border border-border overflow-hidden",
            "bg-card card-highlight shadow-card"
          )}
        >
          {/* Inner top edge keyline */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              id={`panel-${current.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${current.id}`}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: prefersReduced ? 0 : 0.22 }}
              className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-border"
            >
              {/* LEFT: Description */}
              <div className="lg:col-span-2 p-7 lg:p-8 space-y-6">
                <div className="space-y-1">
                  <span className="text-eyebrow text-accent">{current.badge}</span>
                  <h3 className="text-heading-md text-card-foreground mt-2">{current.headline}</h3>
                  <p className="text-body-sm text-muted-foreground leading-relaxed pt-1">
                    {current.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <p className="text-eyebrow text-muted-foreground">Protocol Details</p>
                  {current.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-2.5">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-body-sm text-muted-foreground">{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: Terminal Mock */}
              <div className="lg:col-span-3 bg-background border-t lg:border-t-0 lg:border-l border-border">
                {/* File tab bar */}
                <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border bg-background-subtle">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  </div>
                  <div className="flex-1 flex">
                    <span className="text-eyebrow text-muted-foreground bg-background border border-border rounded-t-sm px-3 py-1 -mb-[1px]">
                      {current.fileName}
                    </span>
                  </div>
                </div>
                {/* Code output — scan-line texture */}
                <pre className={cn(
                  "p-5 overflow-x-auto text-[0.78rem] leading-relaxed font-mono",
                  "text-muted-foreground bg-noise",
                  "min-h-[260px]",
                  "tabular-nums" // non-obvious: tabular nums in terminal mock
                )}>
                  <code>{current.output}</code>
                </pre>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
