"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface MarqueeItem {
  name: string;
  icon: React.ElementType;
  /** Official brand hex color — rendered via inline style */
  color?: string;
}

interface MarqueeWallProps {
  row1: MarqueeItem[];
  row2: MarqueeItem[];
  className?: string;
}

export function MarqueeWall({ row1, row2, className }: MarqueeWallProps) {
  const prefersReduced = useReducedMotion();

  const doubledRow1 = [...row1, ...row1, ...row1];
  const doubledRow2 = [...row2, ...row2, ...row2];

  if (prefersReduced) {
    return (
      <div className={cn("grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 py-6", className)}>
        {[...row1, ...row2].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.name}-${idx}`}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl border border-border bg-card text-xs font-mono text-muted-foreground"
            >
              <Icon
                className="h-4 w-4 shrink-0"
                style={item.color ? { color: item.color } : undefined}
              />
              <span>{item.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative py-8 overflow-hidden",
        "[perspective:1000px]",
        className
      )}
    >
      {/* 3D perspective plane */}
      <div className="space-y-4 [transform:rotateX(10deg)_rotateY(-2deg)] [transform-style:preserve-3d]">
        {/* Row 1 — scrolls leftward */}
        <div
          className="relative flex overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-4 animate-marquee hover:[animation-play-state:paused] py-1">
            {doubledRow1.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`row1-${item.name}-${idx}`}
                  className={cn(
                    "flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-xl",
                    "border border-border bg-card shadow-card card-highlight",
                    "text-xs font-mono text-card-foreground",
                    "transition-all duration-200 ease-out",
                    "hover:scale-105 hover:border-border-strong hover:shadow-card-hover"
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={item.color ? { color: item.color } : undefined}
                  />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Row 2 — scrolls rightward */}
        <div
          className="relative flex overflow-hidden"
          style={{
            maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
          }}
        >
          <div className="flex items-center gap-4 animate-marquee-reverse hover:[animation-play-state:paused] py-1">
            {doubledRow2.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={`row2-${item.name}-${idx}`}
                  className={cn(
                    "flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-xl",
                    "border border-border bg-card shadow-card card-highlight",
                    "text-xs font-mono text-card-foreground",
                    "transition-all duration-200 ease-out",
                    "hover:scale-105 hover:border-border-strong hover:shadow-card-hover"
                  )}
                >
                  <Icon
                    className="h-4 w-4 shrink-0"
                    style={item.color ? { color: item.color } : undefined}
                  />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
