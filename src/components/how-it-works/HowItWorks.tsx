"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { InteractiveMascot } from "@/components/InteractiveMascot";
import { TextEffect } from "@/components/motion/TextEffect";
import { InView } from "@/components/motion/InView";
import { motionEases, motionDurations } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    title: "Choose what fits you",
    body: "Pick your tier — Budget, Executive, or Premium — then a 5-day or 6-day week and veg or non-veg where the menu offers a choice.",
    marker: "01",
  },
  {
    title: "We cook with care",
    body: "Home-style comfort meals and a daily dessert, made fresh every morning in our Mangaf kitchen and packed in your tiffin.",
    marker: "02",
  },
  {
    title: "Delivered to your door",
    body: "Message us on WhatsApp — we deliver across Mina Abdulla, Fahaheel, and Ahmadi every working day.",
    marker: "03",
  },
] as const;

/** Max head yaw / pitch in degrees while following the cursor. */
const LOOK_YAW = 28;
const LOOK_PITCH = 12;

export function HowItWorks() {
  const section = useRef<HTMLElement>(null);
  const lookLayer = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (reducedMotion) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-path-progress]", {
          scaleX: 0,
          transformOrigin: "left center",
          ease: motionEases.scrub,
          scrollTrigger: {
            trigger: section.current,
            start: "top 65%",
            end: "bottom 55%",
            scrub: true,
          },
        });

        // Position only — head look owns rotation on the inner layer.
        gsap.to("[data-mascot-guide]", {
          xPercent: 12,
          y: -20,
          ease: motionEases.scrub,
          scrollTrigger: {
            trigger: section.current,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });

        gsap.from("[data-step-marker]", {
          scale: 0.7,
          opacity: 0.35,
          stagger: 0.12,
          ease: motionEases.enter,
          scrollTrigger: {
            trigger: section.current,
            start: "top 60%",
            end: "center center",
            scrub: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: section, dependencies: [reducedMotion] },
  );

  useGSAP(
    () => {
      const root = section.current;
      const face = lookLayer.current;
      if (!root || !face || reducedMotion) return;

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      if (!finePointer.matches) return;

      gsap.set(face, {
        transformOrigin: "50% 18%",
        transformPerspective: 900,
        force3D: true,
        rotationX: 0,
        rotationY: 0,
      });

      const lookY = gsap.quickTo(face, "rotationY", {
        duration: motionDurations.slow,
        ease: motionEases.standard,
      });
      const lookX = gsap.quickTo(face, "rotationX", {
        duration: motionDurations.slow,
        ease: motionEases.standard,
      });

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = face.getBoundingClientRect();
        const headX = bounds.left + bounds.width / 2;
        const headY = bounds.top + bounds.height * 0.22;
        const reachX = Math.max(bounds.width * 2.2, 220);
        const reachY = Math.max(bounds.height * 1.6, 180);
        const x = Math.max(-1, Math.min(1, (event.clientX - headX) / reachX));
        const y = Math.max(-1, Math.min(1, (event.clientY - headY) / reachY));
        lookY(x * LOOK_YAW);
        lookX(-y * LOOK_PITCH);
      };

      const resetLook = () => {
        lookY(0);
        lookX(0);
      };

      root.addEventListener("pointermove", handlePointerMove, { passive: true });
      root.addEventListener("pointerleave", resetLook);

      return () => {
        root.removeEventListener("pointermove", handlePointerMove);
        root.removeEventListener("pointerleave", resetLook);
        gsap.killTweensOf(face);
        gsap.set(face, { rotationX: 0, rotationY: 0 });
      };
    },
    { scope: section, dependencies: [reducedMotion] },
  );

  return (
    <section
      ref={section}
      id="how-it-works"
      className="relative overflow-hidden bg-forest-deep py-20 text-cream sm:py-28"
      aria-labelledby="how-heading"
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,var(--color-lime)_1px,transparent_0)] [background-size:28px_28px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-extrabold tracking-[0.18em] text-lime uppercase">
              How it works
            </p>
            <TextEffect
              as="h2"
              id="how-heading"
              per="word"
              className="mt-3 font-display text-4xl leading-tight font-extrabold sm:text-5xl"
            >
              Your week, one friendly path.
            </TextEffect>
            <InView>
              <p className="mt-4 max-w-[42ch] text-lg font-semibold text-cream/75">
                A simple three-stop journey — choose, cook, deliver — guided by
                the Tiffimu mascot.
              </p>
            </InView>
          </div>
          <div
            data-mascot-guide
            className="mx-auto h-52 w-40 shrink-0 [perspective:900px] sm:h-64 sm:w-48 lg:mx-0 lg:h-72 lg:w-52"
          >
            <div
              ref={lookLayer}
              data-mascot-look
              className="h-full w-full [transform-style:preserve-3d] will-change-transform"
              style={{ transformOrigin: "50% 18%" }}
            >
              <InteractiveMascot
                variant="wave"
                initialEvent="IDLE"
                interactEvent="WELCOME"
                className="h-full w-full cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-[2.15rem] right-6 left-6 hidden h-1.5 rounded-full bg-forest md:block"
          >
            <div
              data-path-progress
              className="h-full origin-left rounded-full bg-lime"
            />
          </div>

          <ol className="grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.marker}>
                <InView
                  delay={index * 0.1}
                  className="hover-lift relative h-full rounded-4xl border border-lime/20 bg-forest/60 p-6 backdrop-blur-sm"
                >
                  <span
                    data-step-marker
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-lime font-display text-lg font-extrabold text-forest-deep"
                  >
                    {step.marker}
                  </span>
                  <h3 className="mt-5 font-display text-2xl font-extrabold">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed font-semibold text-cream/75 sm:text-base">
                    {step.body}
                  </p>
                </InView>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
