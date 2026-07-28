"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type PhotoCardProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  tilt?: number;
};

/**
 * Premium floating photo card — soft bob + pointer tilt.
 */
export function PhotoCard({
  src,
  alt,
  caption,
  className = "",
  priority = false,
  sizes = "(max-width: 768px) 50vw, 20rem",
  tilt = 0,
}: PhotoCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.soft);
  const springY = useSpring(y, motionSprings.soft);
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  return (
    <motion.div
      ref={rootRef}
      className={`floating-panel-image relative ${className}`}
      style={{ perspective: 1200 }}
      onPointerMove={(event) => {
        if (reducedMotion || event.pointerType === "touch") return;
        const node = rootRef.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileHover={reducedMotion ? undefined : { y: -6 }}
      transition={motionSprings.snappy}
    >
      <motion.figure
        className="overflow-hidden rounded-[1.35rem] border border-white/75 bg-cream/90 p-1.5 shadow-[0_22px_48px_-22px_rgba(30,52,25,0.5)]"
        style={
          reducedMotion
            ? { rotate: tilt }
            : {
                rotateX,
                rotateY,
                rotate: tilt,
                transformStyle: "preserve-3d",
              }
        }
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.05rem]">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className="object-cover"
          />
        </div>
        {caption ? (
          <figcaption className="px-2 py-2 text-center font-display text-sm font-extrabold text-forest">
            {caption}
          </figcaption>
        ) : null}
      </motion.figure>
    </motion.div>
  );
}
