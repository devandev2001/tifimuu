"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEntrance } from "@/components/motion/EntranceContext";
import { motionSprings } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";

const SPOTLIGHT = {
  src: "/menu/meals/tuesday-pulao.jpg",
  label: "Tuesday favourite",
  detail: "Home-style pulao",
} as const;

type AnimatedFoodHeroProps = {
  priority?: boolean;
};

function DishShell({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <figure
      className={`overflow-hidden rounded-[1.75rem] border border-white/80 bg-cream/95 p-2 shadow-[0_24px_50px_-20px_rgba(30,52,25,0.45)] ${className}`}
    >
      {children}
    </figure>
  );
}

/**
 * Full-bleed dominant food stage with Framer pointer tilt (one transform owner).
 */
export function AnimatedFoodHero({ priority = false }: AnimatedFoodHeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { playEntrance } = useEntrance();
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, motionSprings.soft);
  const springY = useSpring(y, motionSprings.soft);
  const rotateX = useTransform(springY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-9, 9]);

  const handlePointerMove = (event: React.PointerEvent) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const resetPointer = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={rootRef}
      className="relative mx-auto aspect-[4/5] w-full max-w-[min(100%,26rem)] lg:max-w-lg"
      style={{ perspective: 1200 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={reducedMotion || !playEntrance ? false : { opacity: 0, scale: 0.94, y: 24 }}
      animate={
        reducedMotion || !playEntrance
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 1, scale: 1, y: 0 }
      }
      transition={{ ...motionSprings.soft, delay: playEntrance ? 0.2 : 0 }}
    >
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-[42%] bg-cream/70 blur-3xl"
      />

      <motion.div
        className="absolute inset-0"
        style={
          reducedMotion
            ? undefined
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
      >
        <DishShell className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden rounded-[1.35rem]">
            <Image
              src={SPOTLIGHT.src}
              alt=""
              fill
              priority={priority}
              sizes="(max-width: 1024px) 90vw, 480px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-forest-deep/80 via-forest-deep/25 to-transparent p-5 pt-16 sm:p-6">
              <p className="text-xs font-extrabold tracking-[0.18em] text-lime uppercase">
                {SPOTLIGHT.label}
              </p>
              <p className="mt-1 font-display text-2xl font-extrabold text-cream sm:text-3xl">
                {SPOTLIGHT.detail}
              </p>
            </div>
          </div>
        </DishShell>

        {!reducedMotion ? (
          <motion.div
            aria-hidden
            className="absolute -top-3 -right-2 size-20 rounded-full border-2 border-cream/80 bg-mint/90 sm:size-24"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </motion.div>
    </motion.div>
  );
}
