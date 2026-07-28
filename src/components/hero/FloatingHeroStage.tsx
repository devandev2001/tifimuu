"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { normalizePointerPosition } from "@/lib/floating-hero";
import { useReducedMotion } from "@/lib/useReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type FloatingHeroStageProps = {
  children: ReactNode;
};

function numberFromData(value: string | undefined): number {
  return Number.parseFloat(value ?? "0") || 0;
}

/**
 * Owns the Poly-inspired depth effects while the hero content remains
 * server-rendered HTML. Scroll and pointer motion act on nested wrappers so
 * they never compete for the same transform.
 */
export function FloatingHeroStage({ children }: FloatingHeroStageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || reducedMotion) return;

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.45,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to("[data-hero-copy]", { yPercent: -16, autoAlpha: 0.7 }, 0)
        .to(
          "[data-hero-object]",
          { yPercent: -13, scale: 1.12, rotate: 4 },
          0,
        )
        .to("[data-hero-glow]", { scale: 1.35, rotate: -8 }, 0)
        .to("[data-hero-scroll-cue]", { autoAlpha: 0, y: 18 }, 0)
        .fromTo(
          "[data-hero-arrival]",
          { autoAlpha: 0, y: 36, scale: 0.94 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.3 },
          0.58,
        );

      root.querySelectorAll<HTMLElement>("[data-hero-card]").forEach((card) => {
        timeline.to(
          card,
          {
            xPercent: numberFromData(card.dataset.heroX),
            yPercent: numberFromData(card.dataset.heroY),
            rotate: numberFromData(card.dataset.heroRotate),
            scale: numberFromData(card.dataset.heroScale) || 1,
          },
          0,
        );
      });
    },
    { scope: rootRef, dependencies: [reducedMotion] },
  );

  useEffect(() => {
    const root = rootRef.current;
    const pointerLayer = root?.querySelector<HTMLElement>(
      "[data-hero-pointer]",
    );
    if (!root || !pointerLayer || reducedMotion) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!finePointer.matches) return;

    const moveX = gsap.quickTo(pointerLayer, "x", {
      duration: 0.8,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(pointerLayer, "y", {
      duration: 0.8,
      ease: "power3.out",
    });

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = root.getBoundingClientRect();
      const pointer = normalizePointerPosition(
        event.clientX,
        event.clientY,
        bounds,
      );
      moveX(pointer.x * 18);
      moveY(pointer.y * 12);
    };

    const resetPointer = () => {
      moveX(0);
      moveY(0);
    };

    root.addEventListener("pointermove", handlePointerMove, { passive: true });
    root.addEventListener("pointerleave", resetPointer);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
      root.removeEventListener("pointerleave", resetPointer);
      gsap.killTweensOf(pointerLayer);
    };
  }, [reducedMotion]);

  return (
    <section
      ref={rootRef}
      id="top"
      className="relative h-[240svh] bg-pistachio motion-reduce:h-auto motion-reduce:min-h-[100svh]"
    >
      {children}
    </section>
  );
}
