"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Copy, Check, Sparkles, FolderGit2, CheckCircle2, Bot, Terminal, Code2 } from "lucide-react";
import {
  SiClaude, SiCursor, SiWindsurf, SiGithubcopilot, SiOpenid, SiGoogle,
} from "react-icons/si";
import catalog from "@/generated/catalog.json";
import { cn } from "@/lib/utils";

type Target = {
  id: string;
  name: string;
  cmd: string;
  fileNote: string;
  descriptor: string;
  details: string;
  icon: React.ElementType;
  nextSteps: string[];
};

const HOST_ICONS: Record<string, React.ElementType> = {
  claude: SiClaude,
  codex: SiOpenid,
  gemini: SiGoogle,
  cursor: SiCursor,
  copilot: SiGithubcopilot,
  windsurf: SiWindsurf,
  "roo-code": Code2,
  cline: Bot,
  aider: Terminal,
  portable: Bot,
};

const HOST_DESTINATIONS: Record<string, string> = {
  claude: ".claude/skills + .claude/agents + commands",
  codex: ".agents/skills + .codex/agents",
  gemini: ".agents/skills + .gemini/commands + agents",
  cursor: ".agents/skills + .cursor/rules + agents",
  copilot: ".agents/skills + .github/prompts + agents",
  windsurf: ".windsurf/skills + workflows + rules",
  "roo-code": ".agents/skills + .roomodes + .roo/rules-*",
  cline: ".cline/skills/product-engineer-pro",
  aider: "CONVENTIONS.md + .aider.conf.yml",
  portable: ".agents/skills + managed AGENTS.md",
};

const TARGETS: Target[] = catalog.hosts.map((host) => ({
  id: host.id,
  name: host.label,
  cmd: host.installCommand,
  fileNote: HOST_DESTINATIONS[host.id] ?? host.skillRoot ?? "Portable configuration",
  descriptor: host.tier.replace("-", " "),
  details: `${host.label} receives the ${host.tier} integration defined by the v2 capability contract. ${host.agents ? "Planner, Builder, and Reviewer roles are generated." : "No package-defined role agents are claimed."}`,
  icon: HOST_ICONS[host.id] ?? Bot,
  nextSteps: [
    "Run the generated command in your project root",
    `Verify discovery with product-engineer-pro doctor --tool ${host.id}`,
    `Invoke ${host.commandStyle} and name one of the 13 specialties`,
  ],
}));

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy command to clipboard"
      className={cn(
        "flex items-center gap-1.5 shrink-0 px-3.5 py-2 rounded-lg text-xs font-mono font-medium",
        "border transition-all duration-150 cursor-pointer min-h-9.5",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "active:scale-95",
        copied
          ? "bg-success/10 border-success/30 text-success font-bold"
          : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border-strong"
      )}
    >
      {copied ? <Check className="h-4 w-4 shrink-0 text-success" /> : <Copy className="h-4 w-4 shrink-0" />}
      <span className="whitespace-nowrap">{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}
export function Install() {
  const [selectedId, setSelectedId] = React.useState("claude");
  const prefersReduced = useReducedMotion();

  const current = TARGETS.find((t) => t.id === selectedId) ?? TARGETS[0];

  return (
    <section id="install" className="relative py-20 sm:py-24 overflow-hidden bg-background-subtle border-y border-border">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="text-eyebrow">Host-Native Installation</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-foreground text-balance">
            App-Like Selector &amp; Live Command Preview
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground text-balance">
            Select your AI environment to view its command and 3-step setup guide.
          </p>
        </div>

        {/* Mobile Horizontal Selector Chips */}
        <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none px-1 min-w-0">
          {TARGETS.map((t) => {
            const Icon = t.icon;
            const isSelected = selectedId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedId(t.id)}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono shrink-0 border transition-all cursor-pointer min-h-11",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary font-bold shadow-glow"
                    : "bg-card text-muted-foreground border-border"
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Two-Panel Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch min-w-0">

          {/* Left Panel: Vertical Target Selector List (Desktop) */}
          <div className="hidden md:flex md:col-span-5 flex-col space-y-3 min-w-0">
            <p className="text-eyebrow text-muted-foreground px-1">Select AI Agent Environment:</p>
            {TARGETS.map((t) => {
              const Icon = t.icon;
              const isSelected = selectedId === t.id;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedId(t.id)}
                  className={cn(
                    "relative flex items-start gap-3.5 p-4 rounded-2xl border text-left transition-colors cursor-pointer overflow-hidden min-w-0",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "bg-card border-primary/40 text-foreground"
                      : "bg-background/60 border-border hover:bg-card hover:border-border-strong text-muted-foreground"
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="install-selector-highlight"
                      className="absolute inset-0 rounded-2xl bg-primary/6 ring-1 ring-inset ring-primary/30"
                      transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}

                  <div className={cn(
                    "relative z-10 h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                    isSelected
                      ? "bg-primary/10 border-primary/30 text-primary scale-105 shadow-glow"
                      : "bg-muted border-border text-muted-foreground"
                  )}>
                    <Icon className="h-5 w-5 shrink-0" />
                  </div>

                  <div className="relative z-10 space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <h4 className={cn("text-sm font-bold truncate min-w-0", isSelected ? "text-foreground" : "text-card-foreground")}>
                        {t.name}
                      </h4>
                      <AnimatePresence>
                        {isSelected && (
                          <motion.span
                            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
                            transition={{ duration: prefersReduced ? 0 : 0.15 }}
                            className="shrink-0"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{t.descriptor}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Panel: Live Preview & What Happens Next */}
          <div className="md:col-span-7 flex flex-col min-w-0">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-card card-highlight flex-1 flex flex-col justify-between space-y-6 min-w-0">

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  transition={{ duration: prefersReduced ? 0 : 0.2 }}
                  className="space-y-6 min-w-0"
                >
                  {/* Top Target Meta Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border min-w-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                        <current.icon className="h-5 w-5 shrink-0" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-card-foreground truncate">{current.name}</h3>
                        <p className="text-xs text-muted-foreground wrap-break-word">{current.details}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-eyebrow text-muted-foreground shrink-0 self-start sm:self-auto font-mono min-w-0">
                      <FolderGit2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate max-w-40 sm:max-w-50 min-w-0">{current.fileNote}</span>
                    </div>
                  </div>

                  {/* Terminal Live Command Box */}
                  <div className="space-y-2 min-w-0">
                    <p className="text-eyebrow text-muted-foreground">Terminal Install Command:</p>
                    <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 bg-background border border-border font-mono text-xs sm:text-sm min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0 overflow-x-auto scrollbar-none">
                        <span className="text-primary font-bold select-none shrink-0">$</span>
                        <span className="text-foreground font-semibold whitespace-nowrap tracking-tight">{current.cmd}</span>
                      </div>
                      <CopyButton text={current.cmd} />
                    </div>
                  </div>

                  {/* What Happens Next Sequence */}
                  <div className="space-y-3 pt-2 min-w-0">
                    <p className="text-eyebrow text-muted-foreground">What Happens Next (3 Steps):</p>
                    <div className="space-y-2 min-w-0">
                      {current.nextSteps.map((step, idx) => (
                        <div key={step} className="flex items-start gap-3 p-2.5 rounded-xl border border-border bg-background/70 text-xs font-mono text-foreground/90 min-w-0">
                          <span className="h-5 w-5 rounded-full bg-primary/15 border border-primary/30 text-primary font-bold flex items-center justify-center shrink-0 text-[0.6875rem]">
                            {idx + 1}
                          </span>
                          <span className="pt-0.5 leading-relaxed wrap-break-word min-w-0">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Bottom Security Keyline */}
              <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs font-mono text-muted-foreground min-w-0">
                <span className="wrap-break-word">✔ Zero Cloud Dependency · Local Configuration</span>
                <span className="text-success font-semibold shrink-0">MIT Licensed</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
