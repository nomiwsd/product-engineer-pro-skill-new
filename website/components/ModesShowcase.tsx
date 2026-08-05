"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import {
  Search, Code2, ShieldAlert, Database, CheckCircle2, ChevronRight, ChevronLeft,
  Layout, Server, Bug, Wrench, Palette, Gauge, Globe, TestTube2,
} from "lucide-react";
import { SiPostgresql, SiMongodb } from "react-icons/si";
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
  {
    id: "frontend",
    name: "Frontend",
    icon: Layout,
    badge: "UI Principal",
    headline: "Next.js & React Component Engineering",
    description: "Enforces App Router / RSC patterns, WCAG 2.2 AA, Core Web Vitals, Tailwind semantic tokens, and shadcn/ui composition — version-adaptive across Next.js 14/15/16.",
    checks: ["RSC vs Client component boundary check", "WCAG 2.2 AA contrast & focus ring audit", "Zero hardcoded hex / CLS dimension guards"],
    stats: [
      { label: "Next.js", value: "14 / 15 / 16" },
      { label: "React", value: "18 / 19 RSC" },
      { label: "A11y", value: "WCAG 2.2 AA" },
    ],
    fileName: "frontend-checklist.md",
    borderAccentClass: "border-l-primary",
    output: ` 1 | [FRONTEND] Mode: Next.js 16 App Router
 2 | ✔ RSC boundary enforced — DashboardClient is 'use client'
 3 | ✔ Page params awaited: const { id } = await params
 4 | ✔ cookies() awaited — required in Next.js 16
 5 |
 6 | ⚠ WARN  components/Card.tsx:18
 7 |         Hardcoded color: style={{ color: '#3b82f6' }}
 8 |         Fix: use var(--color-primary) semantic token
 9 |
10 | ✔ Image explicit width/height — CLS = 0
11 | ✔ WCAG AA contrast verified: 7.1:1 on primary text
12 | ────────────────────────────────────────────────────────
13 | Status: Frontend check complete — 0 Critical · 1 Warning`,
  },
  {
    id: "backend",
    name: "Backend",
    icon: Server,
    badge: "API Principal",
    headline: "Node.js, Express & NestJS API Engineering",
    description: "Generates OWASP-hardened API routes, NestJS modules with guards/pipes/DTOs, and Express controllers with strict Zod validation and rate limiting.",
    checks: ["Zod body validation before db.create()", "JWT + RBAC guard on protected routes", "Express arity-4 error handler placement"],
    stats: [
      { label: "Express", value: "v4 / v5" },
      { label: "NestJS", value: "v10 / v11" },
      { label: "Node", value: "v20+ ESM" },
    ],
    fileName: "api-route.ts",
    borderAccentClass: "border-l-accent",
    output: ` 1 | [BACKEND] Target: POST /api/orders
 2 | + export async function POST(req: Request) {
 3 | +   const body = await req.json();
 4 | +   const data = OrderSchema.parse(body);  // Zod guard
 5 | +   const session = await auth();           // JWT check
 6 | +   if (!session) return unauthorized();
 7 | +
 8 | +   const order = await db.order.create({ data });
 9 | +   return NextResponse.json(order, { status: 201 });
10 | + }
11 |
12 | ✔ Zod schema enforced · Auth guard active
13 | ────────────────────────────────────────────────────────
14 | Status: Route generated — OWASP A03 injection-safe`,
  },
  {
    id: "design-system",
    name: "Design System",
    icon: Palette,
    badge: "Token Architecture",
    headline: "OKLCH Design Tokens & Advanced UI/UX",
    description: "Scaffolds a 3-layer token system (primitive → semantic → component) with OKLCH color scales, 4px grid spacing, micro-animations, and glassmorphism utilities.",
    checks: ["OKLCH perceptual color scale generation", "4px/8px grid spacing enforcement", "prefers-reduced-motion animation guards"],
    stats: [
      { label: "Color Space", value: "OKLCH" },
      { label: "Grid Unit", value: "4px base" },
      { label: "Dark Mode", value: "Semantic" },
    ],
    fileName: "tailwind-tokens.css",
    borderAccentClass: "border-l-primary",
    output: ` 1 | @theme {
 2 |   /* OKLCH Primitives */
 3 |   --color-brand-500: oklch(0.58 0.19 250);
 4 |   --color-neutral-950: oklch(0.14 0.01 250);
 5 |
 6 |   /* Semantic tokens — components consume these */
 7 |   --color-primary: var(--color-brand-500);
 8 |   --color-background: oklch(0.99 0 0);
 9 |
10 |   /* Motion easing */
11 |   --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
12 |   --shadow-glow: 0 0 20px -5px var(--color-primary);
13 | }
14 | .dark { --color-background: oklch(0.14 0.01 250); }
15 | ────────────────────────────────────────────────────────
16 | Status: Token scaffold generated — 0 hardcoded hex`,
  },
  {
    id: "performance",
    name: "Performance",
    icon: Gauge,
    badge: "Core Web Vitals",
    headline: "LCP, INP & CLS Optimization",
    description: "Diagnoses bundle bloat, missing image dimensions, font-display issues, and dynamic import opportunities to hit LCP < 1.2s, INP < 100ms, and CLS = 0.",
    checks: ["Image dimension guard — CLS = 0", "Dynamic import split for heavy libs", "Font-display: swap + subset verification"],
    stats: [
      { label: "LCP Target", value: "< 1.2s" },
      { label: "INP Target", value: "< 100ms" },
      { label: "CLS Target", value: "= 0" },
    ],
    fileName: "vitals-report.md",
    borderAccentClass: "border-l-success",
    output: ` 1 | [PERFORMANCE] Bundle analysis: /app/dashboard
 2 |
 3 | ✖ ERROR  LCP: 3.4s — exceeds 1.2s budget
 4 |           Cause: /lib/chart.js (480KB) loaded eagerly
 5 |           Fix: dynamic(() => import('@/lib/chart'), { ssr: false })
 6 |
 7 | ⚠ WARN   Image /hero.png — missing width/height → CLS risk
 8 |           Fix: <Image width={1200} height={630} .../>
 9 |
10 | ✔ Font: Inter subset via next/font — display:swap OK
11 | ────────────────────────────────────────────────────────
12 | Status: 1 Critical fix · 1 Warning · LCP budget restoring`,
  },
  {
    id: "seo",
    name: "SEO",
    icon: Globe,
    badge: "Technical SEO",
    headline: "Metadata, Sitemap & Structured Data",
    description: "Audits meta tags, Open Graph, canonical URLs, sitemap.xml, robots.txt, and JSON-LD structured data to fix indexability and rich result eligibility.",
    checks: ["generateMetadata() per route check", "Canonical URL & OG tag completeness", "JSON-LD Article / Product schema"],
    stats: [
      { label: "Coverage", value: "Meta + OG" },
      { label: "Schema", value: "JSON-LD" },
      { label: "robots.txt", value: "Validated" },
    ],
    fileName: "seo-audit.md",
    borderAccentClass: "border-l-accent",
    output: ` 1 | [SEO] Scanning: /app/**/page.tsx
 2 |
 3 | ✖ ERROR  /app/blog/[slug]/page.tsx
 4 |           Missing generateMetadata() export
 5 |           Fix: export async function generateMetadata({ params })
 6 |
 7 | ⚠ WARN   /app/about/page.tsx
 8 |           og:image missing — falls back to default
 9 |
10 | ✔ sitemap.xml detected and valid
11 | ✔ robots.txt: no critical disallow rules
12 | ────────────────────────────────────────────────────────
13 | Status: 1 Critical · 1 Warning · Sitemap OK`,
  },
  {
    id: "debug",
    name: "Debug",
    icon: Bug,
    badge: "Root Cause Analysis",
    headline: "Bug Diagnosis & Root Cause Investigation",
    description: "Traces runtime errors, hydration mismatches, async race conditions, and type errors to their root cause and provides a minimal, targeted fix.",
    checks: ["Hydration mismatch source tracing", "Async/await race condition detection", "TypeScript error root cause isolation"],
    stats: [
      { label: "Fix Scope", value: "Minimal Diff" },
      { label: "Trace Depth", value: "Full Stack" },
      { label: "Side Effects", value: "Zero" },
    ],
    fileName: "debug-trace.log",
    borderAccentClass: "border-l-destructive",
    output: ` 1 | [DEBUG] Error: Hydration mismatch in <ThemeProvider>
 2 | Traceback:
 3 |   app/layout.tsx:12 → <ThemeProvider>
 4 |   components/Navbar.tsx:44 → useTheme()
 5 |
 6 | Root Cause: theme read on server (SSR) before mount
 7 | Pattern: useState(false) — set true on useEffect mount
 8 |
 9 | Fix:
10 | +  const [mounted, setMounted] = useState(false);
11 | +  useEffect(() => setMounted(true), []);
12 | +  if (!mounted) return <Skeleton />;
13 | ────────────────────────────────────────────────────────
14 | Status: Root cause identified — minimal fix generated`,
  },
  {
    id: "refactor",
    name: "Refactor",
    icon: Wrench,
    badge: "Code Cleanup",
    headline: "Structural Refactoring Without Breaking Contracts",
    description: "Eliminates duplication, extracts reusable hooks and utilities, and enforces consistent naming without touching public API contracts, existing tests, or comments.",
    checks: ["Public API contract preservation", "Docstring & comment retention", "Zero new external dependency introduction"],
    stats: [
      { label: "API Safety", value: "100%" },
      { label: "Diff Style", value: "Additive" },
      { label: "Test Impact", value: "Zero Break" },
    ],
    fileName: "refactor.patch",
    borderAccentClass: "border-l-success",
    output: ` 1 | [REFACTOR] Target: lib/api/users.ts
 2 |
 3 | - async function fetchUser(id: string) {
 4 | -   const res = await fetch('/api/users/' + id);
 5 | -   const data = await res.json();
 6 | -   return data;
 7 | - }
 8 | + async function fetchUser(id: string): Promise<User> {
 9 | +   const res = await fetch(\`/api/users/\${id}\`);
10 | +   if (!res.ok) throw new ApiError(res.status);
11 | +   return UserSchema.parse(await res.json());
12 | + }
13 | ────────────────────────────────────────────────────────
14 | Status: Refactored — existing tests: 0 failures`,
  },
  {
    id: "test",
    name: "Test",
    icon: TestTube2,
    badge: "Test Generation",
    headline: "Unit, Integration & E2E Test Assertions",
    description: "Generates co-located unit tests with Vitest/Jest, API integration tests with Supertest, and Playwright E2E specs — all with typed mock factories.",
    checks: ["Typed mock factory generation", "Edge case & error path coverage", "Playwright E2E happy path spec"],
    stats: [
      { label: "Coverage", value: "≥ 80% Target" },
      { label: "Framework", value: "Vitest / Jest" },
      { label: "E2E", value: "Playwright" },
    ],
    fileName: "user.spec.ts",
    borderAccentClass: "border-l-primary",
    output: ` 1 | // unit: lib/api/users.test.ts
 2 | import { describe, it, expect, vi } from 'vitest';
 3 |
 4 | describe('fetchUser', () => {
 5 |   it('returns parsed user on 200', async () => {
 6 |     vi.spyOn(global, 'fetch').mockResolvedValueOnce(
 7 |       new Response(JSON.stringify(mockUser), { status: 200 })
 8 |     );
 9 |     const result = await fetchUser('usr_123');
10 |     expect(result.id).toBe('usr_123');
11 |   });
12 |   it('throws ApiError on 404', async () => {
13 |     expect(fetchUser('bad')).rejects.toThrow(ApiError);
14 |   });
15 | });
16 | ────────────────────────────────────────────────────────
17 | Status: Tests generated — 2 cases · 0 skipped`,
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
  const tabsRef = React.useRef<HTMLDivElement>(null);

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : MODES.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < MODES.length - 1 ? prev + 1 : 0));

  // Auto-scroll the pill nav so the active button is always visible
  React.useEffect(() => {
    const container = tabsRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLElement>(`[data-active="true"]`);
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeIndex]);

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

        {/* Synced Mode Navigation Pills — Smooth auto-scroll to active */}
        <div
          ref={tabsRef}
          className="w-full max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none mb-8 sm:mb-10"
        >
          <div
            role="tablist"
            aria-label="Operating mode selector"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="flex items-center justify-start gap-2 min-w-max pb-2 pt-1 focus-visible:outline-none"
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
                  data-active={isActive ? "true" : "false"}
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
                </button>
              );
            })}
          </div>
        </div>

        {/*
          Wrapper: chevron buttons sit OUTSIDE the overflow-hidden container
          so they are never clipped. The coverflow container itself only
          applies perspective + overflow-hidden on lg+.
        */}
        <div className="relative max-w-5xl mx-auto">

          {/* Desktop chevron buttons — OUTSIDE overflow-hidden, always visible */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous mode"
            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-muted transition-all duration-150 cursor-pointer shadow-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next mode"
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-muted transition-all duration-150 cursor-pointer shadow-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Mobile + Tablet: compact prev/next row above the active card */}
          <div className="flex lg:hidden items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous mode"
              className="h-11 w-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-eyebrow text-muted-foreground">
              {MODES[activeIndex].name} — {activeIndex + 1} of {MODES.length}
            </span>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next mode"
              className="h-11 w-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* 3D coverflow container — overflow-hidden only on lg+ */}
          <div className="lg:[perspective:1500px] lg:overflow-hidden rounded-2xl">
            {/*
              h-auto below lg (natural stacking flow),
              fixed h-[580px] on lg+ where absolute-positioned slides live.
            */}
            <div className="relative w-full h-auto lg:h-[580px] lg:[transform-style:preserve-3d]">
              {MODES.map((mode, idx) => {
                const isActive = activeIndex === idx;

                // Correct wrapping for any number of modes:
                // Find the shortest circular distance between idx and activeIndex
                const n = MODES.length;
                let position = ((idx - activeIndex) % n + n) % n;
                if (position > n / 2) position -= n; // range: -(n/2) to +(n/2)

                // Below lg: only the active slide renders in normal document flow
                const mobileVisibilityClass = isActive ? "block" : "hidden lg:block";

                const style: React.CSSProperties = prefersReduced
                  ? { opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }
                  : { ...getSlideStyle(position), transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.4s ease" };

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
          <span className="text-eyebrow whitespace-nowrap shrink-0">Mode {idx + 1} of {MODES.length}</span>
        </div>

        <pre className="my-2 p-4 rounded-xl bg-noise border border-border text-xs font-mono leading-relaxed overflow-auto text-foreground/90 tabular-nums max-h-[400px] flex-1 min-w-0">
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