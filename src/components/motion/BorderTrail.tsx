"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

type BorderTrailProps = {
  children: ReactNode;
  className?: string;
  /** Trail color token class, e.g. bg-lime */
  trailClassName?: string;
};

/**
 * Soft animated border trail around interactive tiles.
 * CSS animation only — paused under prefers-reduced-motion.
 */
export function BorderTrail({
  children,
  className = "",
  trailClassName = "bg-lime",
}: BorderTrailProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!reducedMotion ? (
        <span
          aria-hidden
          className={`border-trail pointer-events-none absolute inset-0 ${trailClassName}`}
        />
      ) : null}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
