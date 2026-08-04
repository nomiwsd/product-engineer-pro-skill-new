"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    value: "cross-model",
    title: "Does this work across Claude, GPT-4o, Gemini, Cursor, Windsurf, and local models?",
    content: (
      <p>
        Yes. <strong className="text-foreground">product-engineer-pro</strong> is built on the open-source Agent Skills standard (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">SKILL.md</code> /{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">AGENTS.md</code>). It functions identically
        across Claude Code, Cursor MDC, Windsurf Cascade, GitHub Copilot, Roo Code, Aider, and local
        Ollama/vLLM models that parse markdown workspace instructions.
      </p>
    ),
  },
  {
    value: "messy-codebase",
    title: "How does it behave on messy or existing codebases?",
    content: (
      <p>
        The skill enforces a{" "}
        <strong className="text-foreground">diff-first, minimal-edits protocol</strong>. The AI agent will
        never perform destructive file rewrites, erase unrelated comments or docstrings, or change naming conventions
        it did not introduce. It inspects your actual{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">package.json</code> and directory
        structure first, then generates only what is explicitly in scope.
      </p>
    ),
  },
  {
    value: "cost",
    title: "Is there any cost, subscription, or telemetry required?",
    content: (
      <p>
        None. <strong className="text-foreground">product-engineer-pro</strong> is 100% open-source under the{" "}
        <strong className="text-foreground">MIT License</strong>. It is distributed as a lightweight npm package that
        installs entirely on your local machine via{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">npx</code>. No cloud service, no
        registration, no telemetry, no API keys.
      </p>
    ),
  },
  {
    value: "older-versions",
    title: "How does it handle older framework versions (Next.js 14, Tailwind v3, etc.)?",
    content: (
      <p>
        The skill includes explicit{" "}
        <strong className="text-foreground">Version-Adaptive Detection</strong>. Before generating any
        code, the agent reads the installed versions from your{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">package.json</code>. If Next.js 14 is
        installed, it uses Page Router conventions. If Next.js 16 is detected, it enforces
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">await cookies()</code> and async route
        parameters automatically.
      </p>
    ),
  },
  {
    value: "contribute",
    title: "How can our team extend this or contribute back?",
    content: (
      <p>
        The installed files land directly in your workspace as plain markdown (
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">.agents/skills/</code> or{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">.claude/skills/</code>
        ). Commit them to your Git repository or customize{" "}
        <code className="text-xs bg-muted px-1.5 py-0.5 rounded border border-border text-primary font-mono">SKILL.md</code>.
        To contribute upstream, open a pull request on GitHub.
      </p>
    ),
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 overflow-hidden bg-background">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/8 text-accent">
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="text-eyebrow">Developer FAQ</span>
          </div>
          <h2 className="text-heading-xl text-foreground">Skeptic-friendly answers</h2>
          <p className="text-body-lg text-muted-foreground text-balance">
            Direct answers for engineering leads and senior developers who need specifics, not marketing copy.
          </p>
        </div>

        <Accordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
