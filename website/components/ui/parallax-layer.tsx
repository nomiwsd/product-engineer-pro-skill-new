"use client";

import * as React from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // negative for reverse direction, e.g. -0.5 to 0.5
}

export function ParallaxLayer({
  children,
  className,
  speed = 0.2,
}: ParallaxLayerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-speed * 100, speed * 100]);

  if (prefersReduced) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={cn(className)}>
      {children}
    </motion.div>
  );
}
