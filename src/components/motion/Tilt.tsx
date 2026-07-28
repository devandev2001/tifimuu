"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionDistances, motionSprings } from "@/lib/motion";

type TiltProps = {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
};

/**
 * Subtle 3D tilt toward the pointer (desktop hover only).
 */
export function Tilt({
  children,
  className = "",
  maxTilt = motionDistances.tilt,
}: TiltProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={motionSprings.soft}
      onPointerMove={(event) => {
        if (event.pointerType === "touch") return;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width;
        const py = (event.clientY - rect.top) / rect.height;
        setRotate({
          x: (0.5 - py) * maxTilt,
          y: (px - 0.5) * maxTilt,
        });
      }}
      onPointerLeave={() => setRotate({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}
