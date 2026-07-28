"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

type FloatingPanelImageProps = {
  src: string;
  alt: string;
  caption: string;
  tilt: number;
  priority?: boolean;
};

/**
 * Single floating plate — CSS owns the bob; Framer owns pointer tilt.
 */
export function FloatingPanelImage({
  src,
  alt,
  caption,
  tilt,
  priority = false,
}: FloatingPanelImageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.soft);
  const springY = useSpring(y, motionSprings.soft);
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handlePointerMove = (event: React.PointerEvent) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const resetPointer = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      className="floating-panel-image relative mx-auto w-full max-w-[min(100%,16rem)] sm:max-w-md lg:max-w-lg"
      data-enter="visual"
    >
      <div
        aria-hidden="true"
        className="absolute inset-[8%] rounded-full bg-cream/70 blur-3xl"
      />
      <motion.div
        ref={rootRef}
        style={{ perspective: 1400 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <motion.figure
          className="relative overflow-hidden rounded-[1.5rem] border border-white/75 bg-cream/90 p-2 shadow-[0_28px_60px_-28px_rgba(30,52,25,0.55)] sm:rounded-[2rem] sm:p-2.5"
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
          <Image
            src={src}
            alt={alt}
            width={960}
            height={1200}
            priority={priority}
            sizes="(max-width: 640px) 16rem, (max-width: 1024px) 24rem, 32rem"
            className="aspect-square max-h-[34svh] w-full rounded-[1.15rem] object-cover sm:aspect-[4/5] sm:max-h-none sm:rounded-[1.55rem]"
          />
          <figcaption className="px-2 pt-2 pb-1 text-center sm:px-3 sm:pt-3 sm:pb-2">
            <span className="font-display text-sm font-extrabold text-forest sm:text-base lg:text-lg">
              {caption}
            </span>
          </figcaption>
        </motion.figure>
      </motion.div>
    </div>
  );
}
