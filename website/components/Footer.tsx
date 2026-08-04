"use client";

import * as React from "react";
import { Terminal, Github } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <a
            href="#"
            className="flex items-center gap-2.5 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              "bg-primary/8 border border-primary/20 text-primary",
              "transition-all duration-200 group-hover:bg-primary/15 group-hover:border-primary/40"
            )}>
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-mono font-bold text-sm">
              <span className="text-foreground">product-engineer</span>
              <span className="text-primary">-pro</span>
            </span>
          </a>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-5">
            {[
              { label: "Docs", href: "https://github.com/nomiwsd/product-engineer-pro-skill-new#readme" },
              { label: "Changelog", href: "https://github.com/nomiwsd/product-engineer-pro-skill-new/blob/main/CHANGELOG.md" },
              { label: "Contributing", href: "https://github.com/nomiwsd/product-engineer-pro-skill-new/blob/main/CONTRIBUTING.md" },
              { label: "MIT License", href: "https://github.com/nomiwsd/product-engineer-pro-skill-new/blob/main/LICENSE" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
              >
                {label}
              </a>
            ))}
            <a
              href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub repository"
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-eyebrow text-muted-foreground">
            © {year} product-engineer-pro contributors. MIT License.
          </p>
          <p className="text-eyebrow text-muted-foreground">
            Built for senior developers &amp; AI engineering agents.
          </p>
        </div>
      </div>
    </footer>
  );
}
