"use client";

import * as React from "react";
import { Terminal } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="#"
              className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring inline-flex"
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center",
                "bg-primary/10 border border-primary/25 text-primary"
              )}>
                <Terminal className="h-3.5 w-3.5" />
              </div>
              <span className="font-mono font-bold text-sm">
                <span className="text-foreground">product-engineer</span>
                <span className="text-primary">-pro</span>
              </span>
            </a>
            <p className="text-body-sm text-muted-foreground max-w-sm leading-relaxed">
              Open-source AI coding agent skill turning any LLM model into a principal-level full-stack engineer.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-4 space-y-3">
            <p className="text-eyebrow text-foreground">Documentation &amp; Source</p>
            <nav aria-label="Footer links" className="flex flex-col space-y-2 text-xs font-mono text-muted-foreground">
              <a
                href="https://github.com/nomiwsd/product-engineer-pro-skill-new#readme"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors w-fit"
              >
                README &amp; Skill Specification
              </a>
              <a
                href="https://github.com/nomiwsd/product-engineer-pro-skill-new/blob/main/CHANGELOG.md"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors w-fit"
              >
                Changelog &amp; Releases
              </a>
              <a
                href="https://github.com/nomiwsd/product-engineer-pro-skill-new/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors w-fit"
              >
                MIT License
              </a>
            </nav>
          </div>

          {/* Col 3: Social & Repository */}
          <div className="md:col-span-3 space-y-3">
            <p className="text-eyebrow text-foreground">Community &amp; Code</p>
            <a
              href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-xs font-mono text-foreground hover:border-border-strong hover:bg-muted transition-all"
            >
              <SiGithub className="h-4 w-4" />
              <span>GitHub Repository</span>
            </a>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-eyebrow text-muted-foreground">
          <p>© {year} product-engineer-pro contributors. MIT License.</p>
          <p>Built for senior developers &amp; AI coding agents.</p>
        </div>

      </div>
    </footer>
  );
}
