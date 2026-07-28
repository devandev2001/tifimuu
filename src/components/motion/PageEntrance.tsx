"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEntrance } from "@/components/motion/EntranceContext";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { motionDurations, motionEases } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

/**
 * Choreographs the first paint of the marketing page after the splash
 * so the handoff feels continuous (not a hard cut).
 */
export function PageEntrance({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { playEntrance } = useEntrance();
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !playEntrance) return;

      const header = root.querySelector("[data-enter='header']");
      const brand = root.querySelectorAll("[data-enter='brand']");
      const copy = root.querySelectorAll("[data-enter='copy']");
      const visual = root.querySelector("[data-enter='visual']");
      const rest = root.querySelectorAll("[data-enter='rest']");

      if (reducedMotion) {
        gsap.set(
          [header, ...brand, ...copy, visual, ...rest].filter(Boolean),
          {
            clearProps: "all",
            autoAlpha: 1,
          },
        );
        return;
      }

      if (header) gsap.set(header, { autoAlpha: 0, y: -12 });
      if (brand.length) gsap.set(brand, { autoAlpha: 0, y: 14 });
      if (copy.length) gsap.set(copy, { autoAlpha: 0, y: 18 });
      if (visual) gsap.set(visual, { autoAlpha: 0, scale: 0.96, y: 20 });
      if (rest.length) gsap.set(rest, { autoAlpha: 0, y: 20 });

      const timeline = gsap.timeline({
        defaults: { ease: motionEases.enter },
      });

      // Mascot leads — continuity with the splash figure dissolving above.
      if (visual) {
        timeline.to(visual, {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          duration: motionDurations.narrative,
        });
      }
      if (header) {
        timeline.to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDurations.slow,
          },
          "-=0.55",
        );
      }
      if (brand.length) {
        timeline.to(
          brand,
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDurations.slow,
            stagger: 0.05,
          },
          "-=0.48",
        );
      }
      if (copy.length) {
        timeline.to(
          copy,
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDurations.slow,
            stagger: 0.06,
          },
          "-=0.3",
        );
      }
      if (rest.length) {
        timeline.to(
          rest,
          {
            autoAlpha: 1,
            y: 0,
            duration: motionDurations.slow,
          },
          "-=0.18",
        );
      }

      return () => {
        timeline.kill();
      };
    },
    { scope: rootRef, dependencies: [playEntrance, reducedMotion] },
  );

  return (
    <div
      ref={rootRef}
      className={
        playEntrance ? undefined : "pointer-events-none opacity-0"
      }
      aria-hidden={!playEntrance}
    >
      {children}
    </div>
  );
}
