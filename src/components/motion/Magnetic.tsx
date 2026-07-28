"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionDistances, motionSprings } from "@/lib/motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/**
 * Pulls toward the pointer on fine-pointer devices (CTA polish).
 */
export function Magnetic({
  children,
  className = "",
  strength = motionDistances.magnetic,
}: MagneticProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`inline-flex ${className}`}
      animate={{ x: offset.x, y: offset.y }}
      transition={motionSprings.magnetic}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        setOffset({
          x: (x / (rect.width / 2)) * (strength * 0.35),
          y: (y / (rect.height / 2)) * (strength * 0.35),
        });
      }}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}
