"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ShieldAlert, Zap, Layers, GitCompare, Database, Accessibility, CheckCircle2, AlertTriangle, Check,
} from "lucide-react";
import { SiNextdotjs, SiTypescript, SiPostgresql, SiTailwindcss, SiMongodb } from "react-icons/si";
import { TiltCard } from "@/components/ui/tilt-card";
import { SpotlightGlow } from "@/components/ui/spotlight-glow";
import { cn } from "@/lib/utils";

type Feature = {
  id: string;
  icon: React.ElementType;
  badge: string;
  title: string;
  description: string;
  gridAreaClass: string;
  brandIcon?: React.ElementType;
  proofType: "code" | "checklist" | "comparison" | "tags";
  proofContent: any;
  metaLine: string;
};

const FEATURES: Feature[] = [
  {
    id: "security",
    icon: ShieldAlert,
    badge: "Security Baseline",
    title: "OWASP-Aligned Security By Default",
    description: "Enforces Zod schema validation, SQL injection prevention, CSRF handling, and auth guard rails before writing any API endpoint.",
    gridAreaClass: "md:[grid-area:security]",
    brandIcon: SiTypescript,
    proofType: "code",
    proofContent: {
      badCode: `// ❌ Unsafe route handler
export async function POST(req: Request) {
  const body = await req.json();
  return db.user.create({ data: body });
}`,
      goodCode: `// ✅ Enforced by product-engineer-pro
export async function POST(req: Request) {
  const body = await req.json();
  const data = UserSchema.parse(body);
  return db.user.create({ data });
}`,
    },
    metaLine: "Applies to: Next.js API Routes, Express, NestJS Controllers",
  },
  {
    id: "version",
    icon: Layers,
    badge: "Version-Adaptive",
    title: "Framework Version Detection",
    description: "Inspects actual package.json before generating code, adapting to Next.js 16 async params automatically.",
    gridAreaClass: "md:[grid-area:version]",
    brandIcon: SiNextdotjs,
    proofType: "code",
    proofContent: `// Next.js 16 signature
const { id } = await params;
const c = await cookies();`,
    metaLine: "Auto-detects: Next 14/15/16, Tailwind v3/v4",
  },
  {
    id: "vitals",
    icon: Zap,
    badge: "Performance",
    title: "Core Web Vitals Enforcement",
    description: "Eliminates CLS with explicit image dimensions, enforces dynamic imports, and optimizes font paths.",
    gridAreaClass: "md:[grid-area:vitals]",
    brandIcon: SiNextdotjs,
    proofType: "checklist",
    proofContent: [
      "Zero CLS layout dimension guards",
      "Dynamic import split for heavy libraries",
      "Font subsetting & display: swap",
    ],
    metaLine: "Target: LCP < 1.2s · INP < 100ms · CLS = 0",
  },
  {
    id: "diff",
    icon: GitCompare,
    badge: "Code Integrity",
    title: "Diff-First Minimal Changes",
    description: "Makes surgical, targeted diffs that preserve existing comments, API contracts, and interfaces.",
    gridAreaClass: "md:[grid-area:diff]",
    proofType: "checklist",
    proofContent: [
      "Preserves docstrings & comments",
      "Strict scope boundary enforcement",
      "Zero wholesale file overwrites",
    ],
    metaLine: "Git delta limit: ≤ 150 lines per atomic commit",
  },
  {
    id: "database",
    icon: Database,
    badge: "Database Architecture",
    title: "PostgreSQL & MongoDB Engine",
    description: "Evaluates domain requirements to select the right database with compound index placement and N+1 prevention.",
    gridAreaClass: "md:[grid-area:database]",
    brandIcon: SiPostgresql,
    proofType: "comparison",
    proofContent: {
      relational: { name: "PostgreSQL", icon: SiPostgresql, note: "ACID · Compound Indexes · Prisma/Drizzle" },
      document: { name: "MongoDB", icon: SiMongodb, note: "Document · Typed Schemas · Mongoose" },
    },
    metaLine: "Supported ORMs: Prisma, Drizzle, Mongoose, TypeORM",
  },
  {
    id: "a11y",
    icon: Accessibility,
    badge: "A11y Verified",
    title: "WCAG 2.2 AA Baseline",
    description: "Enforces 4.5:1 contrast ratios, sequential tab order, complete ARIA attributes, and reduced-motion.",
    gridAreaClass: "md:[grid-area:a11y]",
    brandIcon: SiTailwindcss,
    proofType: "tags",
    proofContent: ["Contrast 4.5:1", "ARIA 1.2", "Keyboard Nav", "Reduced Motion"],
    metaLine: "Validated against: Screen Readers & Axe-core",
  },
];

function HeroCodeToggle({ badCode, goodCode }: { badCode: string; goodCode: string }) {
  const [showGood, setShowGood] = React.useState(true);

  return (
    <div className="mt-3 rounded-xl border border-border bg-background overflow-hidden font-mono text-xs min-w-0">
      <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-background-subtle border-b border-border min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          {showGood ? (
            <span className="flex items-center gap-1.5 text-success font-medium truncate">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Enforced Pattern
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-destructive font-medium truncate">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Blocked Unsafe Code
            </span>
          )}
        </div>
        <div className="flex rounded-lg bg-muted p-0.5 border border-border shrink-0">
          <button
            type="button"
            onClick={() => setShowGood(false)}
            className={cn(
              "px-2 py-0.5 rounded-md text-[0.6875rem] transition-colors cursor-pointer",
              !showGood ? "bg-destructive text-destructive-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Before
          </button>
          <button
            type="button"
            onClick={() => setShowGood(true)}
            className={cn(
              "px-2 py-0.5 rounded-md text-[0.6875rem] transition-colors cursor-pointer",
              showGood ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            After
          </button>
        </div>
      </div>
      <pre className="p-3 overflow-x-auto text-muted-foreground leading-relaxed min-w-0">
        <code className="whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">
          {showGood ? goodCode : badCode}
        </code>
      </pre>
    </div>
  );
}

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
    <section id="features" className="relative py-20 sm:py-24 overflow-hidden bg-background-subtle border-y border-border">
      <div className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12 space-y-3">
          <p className="text-eyebrow text-primary">Capabilities &amp; Proof Standards</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">
            Engineering rigor, not generic template text
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance">
            Concrete architectural rules, validation protocols, and security guards with live verification proofs.
          </p>
        </div>

        {/*
          Mobile/tablet (below md): plain single-column grid — grid-area
          classes are scoped to md: only, so on small screens this is a
          normal stacked flow with zero risk of area-name mismatch errors.
          Desktop (md+): explicit template — 3 rows, no card ever spans
          multiple rows except the intentional hero, eliminating dead space.
        */}
        <motion.div
          variants={containerVars}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:[grid-template-areas:'security_security_version'_'security_security_vitals'_'diff_database_a11y']"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const Brand = feature.brandIcon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVars}
                className={cn(feature.gridAreaClass, "min-w-0")}
              >
                <TiltCard
                  tiltDegree={5}
                  className={cn(
                    "h-full p-5 lg:p-6 flex flex-col min-w-0",
                    feature.id === "security" && "border-primary/40 shadow-glow"
                  )}
                >
                  <SpotlightGlow className="h-full flex flex-col min-w-0">
                    <div className="space-y-3 flex-1 min-w-0">
                      {/* Top Tile Row */}
                      <div className="flex items-start justify-between gap-2 min-w-0">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                            <Icon className="h-5 w-5 shrink-0" />
                          </div>
                          {Brand && (
                            <div className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground shrink-0">
                              <Brand className="h-4 w-4 shrink-0" />
                            </div>
                          )}
                        </div>
                        <span className="text-eyebrow text-muted-foreground px-2.5 py-1 rounded-md bg-muted border border-border shrink-0 whitespace-nowrap">
                          {feature.badge}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-card-foreground break-words">
                          {feature.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                          {feature.description}
                        </p>
                      </div>

                      {/* Concrete Proof Elements per Card */}
                      {feature.proofType === "code" && feature.id === "security" && (
                        <div className="space-y-3 min-w-0">
                          <HeroCodeToggle
                            badCode={feature.proofContent.badCode}
                            goodCode={feature.proofContent.goodCode}
                          />
                          <div className="pt-2 border-t border-border/60 space-y-1.5 font-mono text-xs text-foreground/90 min-w-0">
                            <p className="text-eyebrow text-muted-foreground">Enforced Automatically:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 min-w-0">
                              <span className="flex items-center gap-1.5 min-w-0"><Check className="h-3.5 w-3.5 text-success shrink-0" /><span className="truncate">Strict Zod request parse</span></span>
                              <span className="flex items-center gap-1.5 min-w-0"><Check className="h-3.5 w-3.5 text-success shrink-0" /><span className="truncate">Parameterized SQL queries</span></span>
                              <span className="flex items-center gap-1.5 min-w-0"><Check className="h-3.5 w-3.5 text-success shrink-0" /><span className="truncate">SameSite Cookie policy</span></span>
                              <span className="flex items-center gap-1.5 min-w-0"><Check className="h-3.5 w-3.5 text-success shrink-0" /><span className="truncate">Rate limit middleware</span></span>
                            </div>
                          </div>
                        </div>
                      )}

                      {feature.proofType === "code" && feature.id !== "security" && (
                        <div className="mt-3 p-2.5 rounded-xl border border-border bg-background font-mono text-xs text-primary/90 leading-relaxed overflow-x-auto min-w-0">
                          <code className="whitespace-pre-wrap break-words sm:whitespace-pre sm:break-normal">
                            {feature.proofContent}
                          </code>
                        </div>
                      )}

                      {feature.proofType === "checklist" && (
                        <div className="mt-3 space-y-1.5 pt-1 min-w-0">
                          {feature.proofContent.map((item: string) => (
                            <div key={item} className="flex items-start gap-2 text-xs font-mono text-foreground/90 min-w-0">
                              <Check className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                              <span className="break-words">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {feature.proofType === "comparison" && (
                        <div className="mt-3 grid grid-cols-2 gap-2 min-w-0">
                          <div className="p-2.5 rounded-xl border border-border bg-background space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono min-w-0">
                              <SiPostgresql className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate">PostgreSQL</span>
                            </div>
                            <p className="text-[0.6875rem] text-muted-foreground font-mono break-words">ACID · Indexes · Prisma</p>
                          </div>
                          <div className="p-2.5 rounded-xl border border-border bg-background space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground font-mono min-w-0">
                              <SiMongodb className="h-3.5 w-3.5 text-success shrink-0" />
                              <span className="truncate">MongoDB</span>
                            </div>
                            <p className="text-[0.6875rem] text-muted-foreground font-mono break-words">Document · Mongoose</p>
                          </div>
                        </div>
                      )}

                      {feature.proofType === "tags" && (
                        <div className="mt-3 flex flex-wrap gap-1.5 min-w-0">
                          {feature.proofContent.map((tag: string) => (
                            <span key={tag} className="px-2 py-0.5 rounded-md border border-border bg-background text-[0.6875rem] font-mono text-muted-foreground whitespace-nowrap">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Anchoring Meta Line */}
                    <div className="mt-4 pt-3 border-t border-border flex items-center justify-between gap-2 text-xs font-mono text-muted-foreground min-w-0">
                      <span className="truncate min-w-0">{feature.metaLine}</span>
                      <span className="text-primary font-bold shrink-0">✓</span>
                    </div>
                  </SpotlightGlow>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}