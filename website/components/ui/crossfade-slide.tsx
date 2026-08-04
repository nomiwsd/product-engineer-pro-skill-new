"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface CrossfadeSlideProps {
  slideKey: string | number;
  children: React.ReactNode;
  className?: string;
}

export function CrossfadeSlide({
  slideKey,
  children,
  className,
}: CrossfadeSlideProps) {
  const prefersReduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={slideKey}
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{
          duration: prefersReduced ? 0 : 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
