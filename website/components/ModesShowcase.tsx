"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import {
  Search, Code2, ShieldAlert, Database, CheckCircle2, ChevronRight, ChevronLeft,
  Layout, Server, Bug, Wrench, Palette, Gauge, Globe, TestTube2,
} from "lucide-react";
import { SiPostgresql } from "react-icons/si";
import catalog from "@/generated/catalog.json";
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

type ModePresentation = Pick<Mode, "id" | "icon" | "fileName" | "borderAccentClass" | "brandIcon">;

const MODE_PRESENTATION: ModePresentation[] = [
  { id: "audit", icon: Search, fileName: "audit-report.log", borderAccentClass: "border-l-primary" },
  { id: "implement", icon: Code2, fileName: "implementation.patch", borderAccentClass: "border-l-primary" },
  { id: "security", icon: ShieldAlert, fileName: "security-review.log", borderAccentClass: "border-l-destructive" },
  { id: "database", icon: Database, fileName: "database-plan.sql", borderAccentClass: "border-l-success", brandIcon: SiPostgresql },
  { id: "review", icon: CheckCircle2, fileName: "review-findings.log", borderAccentClass: "border-l-accent" },
  { id: "frontend", icon: Layout, fileName: "frontend-workflow.log", borderAccentClass: "border-l-primary" },
  { id: "backend", icon: Server, fileName: "backend-workflow.log", borderAccentClass: "border-l-success" },
  { id: "design-system", icon: Palette, fileName: "design-system.log", borderAccentClass: "border-l-accent" },
  { id: "performance", icon: Gauge, fileName: "performance-evidence.log", borderAccentClass: "border-l-primary" },
  { id: "seo", icon: Globe, fileName: "seo-review.log", borderAccentClass: "border-l-success" },
  { id: "debug", icon: Bug, fileName: "debug-evidence.log", borderAccentClass: "border-l-destructive" },
  { id: "refactor", icon: Wrench, fileName: "refactor-plan.log", borderAccentClass: "border-l-accent" },
  { id: "test", icon: TestTube2, fileName: "test-workflow.log", borderAccentClass: "border-l-primary" },
];

const MODES: Mode[] = MODE_PRESENTATION.map((presentation) => {
  const workflow = catalog.workflows.find((item) => item.id === presentation.id);
  if (!workflow) throw new Error(`Missing workflow manifest entry: ${presentation.id}`);
  const aliases = workflow.aliases.length ? workflow.aliases.join(", ") : "none";
  return {
    ...presentation,
    name: workflow.label,
    badge: `${workflow.defaultLifecycle} lifecycle`,
    headline: `${workflow.label} engineering workflow`,
    description: workflow.description,
    checks: [
      `Aliases: ${aliases}`,
      workflow.diagnostic ? "Evidence-first diagnosis is available" : "Build intent routes directly to implementation",
      workflow.buildCapable ? "Edits require user intent and writable host state" : "Read-only findings and explicit handoff",
    ],
    stats: [
      { label: "Lifecycle", value: workflow.defaultLifecycle },
      { label: "Diagnostic", value: workflow.diagnostic ? "Supported" : "Not primary" },
      { label: "Mutation", value: workflow.buildCapable ? "Host-controlled" : "Read-only" },
    ],
    output: ` 1 | [${workflow.id.toUpperCase()}] Product Engineer Pro v${catalog.version}
 2 | Lifecycle: ${workflow.defaultLifecycle} (host state remains authoritative)
 3 | Recipe: references/workflows/${workflow.id}.md
 4 | Repository versions and conventions are inspected first
 5 | Verification claims require observed evidence
 6 | Status: workflow routed from canonical manifest`,
  };
});

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
  // Skip auto-scroll on initial mount — only scroll when user navigates
  const isMounted = React.useRef(false);

  const handlePrev = () => setActiveIndex((prev) => (prev > 0 ? prev - 1 : MODES.length - 1));
  const handleNext = () => setActiveIndex((prev) => (prev < MODES.length - 1 ? prev + 1 : 0));

  // Auto-scroll the pill nav so the active button is always visible
  React.useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return; // skip on first render — prevents page jump on load
    }
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
          <p className="text-eyebrow text-accent">Engineering Workflows — 3D Coverflow</p>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">
            Specialized workflows, invoked on demand
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance">
            Choose a specialty here; your host&apos;s Plan, Ask, Agent, or editing state independently controls mutation.
          </p>
        </div>

        {/* Synced Mode Navigation Pills — Smooth auto-scroll to active */}
        <div
          ref={tabsRef}
          className="w-full max-w-full -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-none mb-8 sm:mb-10"
        >
          <div
            role="tablist"
            aria-label="Engineering workflow selector"
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
                    "border transition-all duration-200 cursor-pointer shrink-0 min-h-11",
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
            aria-label="Previous workflow"
            className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-muted transition-all duration-150 cursor-pointer shadow-card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next workflow"
            className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-50 h-11 w-11 rounded-full border border-border bg-background/95 backdrop-blur-md items-center justify-center text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-muted transition-all duration-150 cursor-pointer shadow-card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Mobile + Tablet: compact prev/next row above the active card */}
          <div className="flex lg:hidden items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous workflow"
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
              aria-label="Next workflow"
              className="h-11 w-11 rounded-full border border-border bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* 3D coverflow container — overflow-hidden only on lg+ */}
          <div className="lg:perspective-[1500px] lg:overflow-hidden rounded-2xl">
            {/*
              h-auto below lg (natural stacking flow),
              fixed h-[580px] on lg+ where absolute-positioned slides live.
            */}
            <div className="relative w-full h-auto lg:h-145 lg:transform-3d">
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
            <h3 className="text-lg font-bold text-card-foreground wrap-break-word">{mode.headline}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1 wrap-break-word">
              {mode.description}
            </p>
          </div>

          <div className="space-y-1.5 pt-2 min-w-0">
            <p className="text-eyebrow text-muted-foreground">What It Checks:</p>
            {mode.checks.map((check) => (
              <div key={check} className="flex items-start gap-2 text-xs font-mono text-foreground/90 min-w-0">
                <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                <span className="wrap-break-word">{check}</span>
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
          <span className="text-eyebrow whitespace-nowrap shrink-0">Workflow {idx + 1} of {MODES.length}</span>
        </div>

        <pre className="my-2 p-4 rounded-xl bg-noise border border-border text-xs font-mono leading-relaxed overflow-auto text-foreground/90 tabular-nums max-h-100 flex-1 min-w-0">
          <code>{mode.output}</code>
        </pre>

        <div className="pt-2 border-t border-border flex items-center justify-between gap-2 text-eyebrow text-muted-foreground shrink-0">
          <span>Workflow Preview</span>
          <span className="text-success font-mono font-bold">Manifest Routed</span>
        </div>
      </div>
    </div>
  );
}
