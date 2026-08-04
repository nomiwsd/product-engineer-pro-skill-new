"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { Button, ButtonProps } from "@/components/ui/button";

interface MagneticButtonProps extends ButtonProps {
  children: React.ReactNode;
  distance?: number;
}

export function MagneticButton({
  children,
  distance = 0.35,
  ...props
}: MagneticButtonProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 250, damping: 18 });
  const springY = useSpring(y, { stiffness: 250, damping: 18 });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * distance;
    const deltaY = (e.clientY - centerY) * distance;

    x.set(deltaX);
    y.set(deltaY);
  };

  const handlePointerLeave = () => {
    if (prefersReduced) return;
    x.set(0);
    y.set(0);
  };

  if (prefersReduced) {
    return <Button {...props}>{children}</Button>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
}
