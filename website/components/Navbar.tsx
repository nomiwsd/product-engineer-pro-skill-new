"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { Sun, Moon, Terminal, Menu, X } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const prefersReduced = useReducedMotion();

  React.useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-lg" aria-hidden="true" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative h-9 w-9 rounded-lg flex items-center justify-center",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      )}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={prefersReduced ? {} : { opacity: 0, scale: 0.6, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={prefersReduced ? {} : { opacity: 0, scale: 0.6, rotate: 30 }}
        transition={{ duration: prefersReduced ? 0 : 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </motion.span>
    </button>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [activeSection, setActiveSection] = React.useState("");

  const navLinks = [
    { name: "Features",  href: "#features" },
    { name: "Stack",     href: "#stack" },
    { name: "Modes",     href: "#modes" },
    { name: "Install",   href: "#install" },
    { name: "FAQ",       href: "#faq" },
  ];

  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="fixed top-3 inset-x-0 z-50 px-4 pointer-events-none">
      <nav
        role="navigation"
        aria-label="Main navigation"
        className={cn(
          "pointer-events-auto max-w-5xl mx-auto rounded-full px-4 py-2.5 flex items-center justify-between",
          "transition-all duration-300 border",
          isScrolled
            ? "bg-background/85 backdrop-blur-xl border-border-strong shadow-card-hover"
            : "bg-background-subtle/80 backdrop-blur-md border-border shadow-card"
        )}
      >
        {/* LOGO */}
        <a
          href="#"
          className="flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group pl-1"
          aria-label="product-engineer-pro home"
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary transition-all duration-200 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:shadow-glow">
            <Terminal className="h-3.5 w-3.5" />
          </div>
          <span className="font-mono font-bold text-[0.8rem] tracking-tight hidden sm:flex items-baseline gap-0.5">
            <span className="text-foreground">product-engineer</span>
            <span className="text-primary">-pro</span>
          </span>
        </a>

        {/* DESKTOP CENTER NAV WITH SLIDING PILL INDICATOR */}
        <div
          className="hidden md:flex items-center gap-1 relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navLinks.map(({ name, href }, idx) => {
            const sectionId = href.slice(1);
            const isActive = activeSection === sectionId;
            const isHovered = hoveredIndex === idx;

            return (
              <a
                key={name}
                href={href}
                onMouseEnter={() => setHoveredIndex(idx)}
                className={cn(
                  "relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-150 z-10",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive || isHovered
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {name}
                {/* Sliding indicator on hover */}
                {isHovered && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 rounded-full bg-muted border border-border -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  />
                )}
                {/* Active indicator dot */}
                {isActive && !isHovered && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                )}
              </a>
            );
          })}
        </div>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/nomiwsd/product-engineer-pro-skill-new"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View on GitHub"
            className={cn(
              "h-9 w-9 flex items-center justify-center rounded-full border border-border bg-card",
              "text-muted-foreground hover:text-foreground hover:border-border-strong hover:bg-muted",
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <SiGithub className="h-4 w-4" />
          </a>
          <Button asChild size="sm" className="font-mono text-xs rounded-full px-4">
            <a href="#install">Get Started</a>
          </Button>
        </div>

        {/* MOBILE RIGHT */}
        <div className="flex md:hidden items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="h-9 w-9 flex items-center justify-center rounded-full text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE PANEL */}
      {mobileOpen && (
        <div className="md:hidden pointer-events-auto mt-2 rounded-2xl border border-border bg-background/95 backdrop-blur-xl p-4 shadow-card space-y-1">
          {navLinks.map(({ name, href }) => (
            <a
              key={name}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {name}
            </a>
          ))}
          <div className="pt-3 border-t border-border mt-3">
            <Button asChild className="w-full font-mono text-sm rounded-xl">
              <a href="#install" onClick={() => setMobileOpen(false)}>
                Install in 30 Seconds
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
