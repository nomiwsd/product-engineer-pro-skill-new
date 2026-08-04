"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";

interface TiltCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  tiltDegree?: number;
  glow?: boolean;
}

export function TiltCard({
  children,
  className,
  tiltDegree = 8,
  glow = true,
  ...props
}: TiltCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Spring physics for fluid return to rest
  const rotateXSpring = useSpring(
    useTransform(mouseY, [0, 1], [tiltDegree, -tiltDegree]),
    { stiffness: 300, damping: 25 }
  );
  const rotateYSpring = useSpring(
    useTransform(mouseX, [0, 1], [-tiltDegree, tiltDegree]),
    { stiffness: 300, damping: 25 }
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
    // Update CSS custom props for spotlight glow
    cardRef.current.style.setProperty("--mouse-x", `${(x * 100).toFixed(1)}%`);
    cardRef.current.style.setProperty("--mouse-y", `${(y * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    if (prefersReduced) return;
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  if (prefersReduced) {
    return (
      <motion.div
        className={cn(
          "rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-200 hover:border-border-strong",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
      }}
      className={cn(
        "group relative rounded-2xl border border-border bg-card p-6 shadow-card card-highlight",
        "transition-all duration-200 ease-out",
        "hover:border-border-strong hover:shadow-card-hover",
        glow && "before:pointer-events-none before:absolute before:-inset-px before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        className
      )}
      {...props}
    >
      {/* 3D Content wrapper */}
      <div className="relative z-10 [transform:translateZ(10px)]">{children}</div>

      {/* Spotlight highlight tracking cursor */}
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--glow-color), transparent 80%)`,
          }}
        />
      )}
    </motion.div>
  );
}
