"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionDurations, motionSprings } from "@/lib/motion";

type InViewProps = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before the enter animation. */
  delay?: number;
  y?: number;
  once?: boolean;
};

/**
 * Fade-up when scrolled into view. Reduced motion → instant opacity only.
 */
export function InView({
  children,
  className = "",
  delay = 0,
  y = 20,
  once = true,
  ...rest
}: InViewProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={className} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: motionDurations.slow,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

type AnimatedGroupProps = {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
};

/**
 * Staggers child enter animations. Wrap each child in motion.div or pass
 * elements that accept motion props via AnimatedGroupItem.
 */
export function AnimatedGroup({
  children,
  className = "",
  stagger = 0.08,
  delayChildren = 0.05,
}: AnimatedGroupProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedGroupItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 18 },
        show: {
          opacity: 1,
          y: 0,
          transition: motionSprings.soft,
        },
      }}
    >
      {children}
    </motion.div>
  );
}
