"use client";

import * as React from "react";
import { Copy, Check, Sparkles, FolderGit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Target = {
  id: string;
  name: string;
  cmd: string;
  fileNote: string;
  description: string;
};

const TARGETS: Target[] = [
  {
    id: "claude",
    name: "Claude / Claude Code",
    cmd: "npx @nomiwsd/product-engineer-pro init",
    fileNote: "CLAUDE.md + .claude/skills/product-engineer-pro/",
    description: "Installs into Claude Code CLI and Anthropic API agents. Writes CLAUDE.md adapter and full skill references.",
  },
  {
    id: "cursor",
    name: "Cursor AI",
    cmd: "npx @nomiwsd/product-engineer-pro init --adapter cursor",
    fileNote: ".cursor/rules/product-engineer-pro.mdc",
    description: "Writes Cursor MDC rules enforcing Next.js 16, React 19, and Tailwind v4 syntax constraints.",
  },
  {
    id: "windsurf",
    name: "Windsurf Cascade",
    cmd: "npx @nomiwsd/product-engineer-pro init --adapter windsurf",
    fileNote: ".windsurfrules",
    description: "Configures Windsurf Cascade memory protocol with engineering constraints and version detection.",
  },
  {
    id: "copilot",
    name: "GitHub Copilot / AGENTS.md",
    cmd: "npx @nomiwsd/product-engineer-pro init --adapter agents",
    fileNote: "AGENTS.md + .agents/skills/product-engineer-pro/",
    description: "Universal AGENTS.md format — works with any open-source coding agent that reads workspace instructions.",
  },
];

function CopyButton({ text, className }: { text: string; className?: string }) {
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
        "flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-lg text-xs font-mono font-medium",
        "border transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "active:scale-95",
        copied
          ? "bg-success/10 border-success/30 text-success"
          : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-border-strong",
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      <span>{copied ? "Copied!" : "Copy"}</span>
    </button>
  );
}

export function Install() {
  const [active, setActive] = React.useState("claude");
  const current = TARGETS.find((t) => t.id === active) ?? TARGETS[0];

  return (
    <section id="install" className="relative py-24 overflow-hidden bg-background">
      {/* Gradient keyline accent at top */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent 0%, var(--primary) 40%, var(--accent) 60%, transparent 100%)", opacity: 0.5 }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/25 bg-primary/8 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="text-eyebrow">30-Second Installation</span>
          </div>
          <h2 className="text-heading-xl text-foreground">Zero config. Instant setup.</h2>
          <p className="text-body-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Select your AI environment and run one command in your project root.
            The skill configures itself automatically.
          </p>
        </div>

        {/* Target selector — horizontal scroll on mobile */}
        <div
          role="tablist"
          aria-label="Installation target"
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          {TARGETS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`install-panel-${t.id}`}
              onClick={() => setActive(t.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-medium",
                "border transition-all duration-150 cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                active === t.id
                  ? "bg-accent text-accent-foreground border-accent font-semibold"
                  : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-border-strong"
              )}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Install card */}
        <div
          id={`install-panel-${current.id}`}
          role="tabpanel"
          aria-label={`Install for ${current.name}`}
          className={cn(
            "rounded-2xl border border-border overflow-hidden card-highlight",
            "bg-card shadow-card"
          )}
        >
          {/* Gradient top keyline — amber accent for CTA feel */}
          <div
            className="h-px"
            style={{ background: "linear-gradient(90deg, var(--accent), var(--primary), transparent)" }}
          />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Target meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-heading-md text-card-foreground">{current.name}</h3>
                <p className="text-body-sm text-muted-foreground mt-0.5">{current.description}</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted border border-border text-eyebrow text-muted-foreground shrink-0">
                <FolderGit2 className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[200px]">{current.fileNote}</span>
              </div>
            </div>

            {/* Command display */}
            <div className={cn(
              "flex items-center justify-between gap-3 rounded-xl px-4 py-3.5",
              "bg-background border border-border font-mono text-sm",
              "overflow-hidden"
            )}>
              <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                <span className="text-primary font-bold select-none shrink-0">$</span>
                <span className="text-foreground truncate tracking-[-0.01em]">{current.cmd}</span>
              </div>
              <CopyButton text={current.cmd} />
            </div>

            {/* Footer row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-border text-xs font-mono text-muted-foreground">
              <span>✔ Detects your package manager · No lock-in · Self-updating</span>
              <span className="text-success font-semibold shrink-0">MIT Licensed · Free Forever</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
