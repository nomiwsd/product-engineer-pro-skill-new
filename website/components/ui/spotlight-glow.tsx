"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface SpotlightGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  radius?: number;
}

export function SpotlightGlow({
  children,
  className,
  radius = 500,
  ...props
}: SpotlightGlowProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty("--spotlight-x", `${x}px`);
    containerRef.current.style.setProperty("--spotlight-y", `${y}px`);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={cn("group relative overflow-hidden", className)}
      {...props}
    >
      {/* Radial Spotlight Overlay */}
      {!prefersReduced && (
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
          style={{
            background: `radial-gradient(${radius}px circle at var(--spotlight-x, 50%) var(--spotlight-y, 50%), var(--glow-color), transparent 75%)`,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
