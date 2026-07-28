"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motionEases } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

/**
 * Intact single cook PNG (never head/body split) + GSAP lid overlay.
 * Sequence: lid lifts off pot → steam → smell lean → overlay fades onto
 * the painted open lid already in the art.
 */
const COOK_SRC = "/characters/cook-reveal/cook-full-v3.png";
const LID_SRC = "/characters/cook-reveal/lid-v3.png";

const LID = {
  closed: { x: 0.18, y: 0.5, rotate: -12 },
  open: { x: 0.58, y: 0.32, rotate: 32 },
  width: 0.3,
} as const;

export function CookRevealCanvas({
  decorative,
}: {
  decorative: boolean;
  onUnavailable?: () => void;
}) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cookRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const playReveal = useCallback(() => {
    const stage = stageRef.current;
    const cook = cookRef.current;
    const lid = lidRef.current;
    const steam = steamRef.current;
    if (!stage || !cook || !lid || !steam) return;

    timelineRef.current?.kill();

    const stageWidth = stage.clientWidth;
    const stageHeight = stage.clientHeight;
    const lidWidth = stageWidth * LID.width;

    gsap.set(lid, {
      width: lidWidth,
      x: stageWidth * LID.closed.x,
      y: stageHeight * LID.closed.y,
      rotate: LID.closed.rotate,
      opacity: 1,
      scale: 1,
      transformOrigin: "50% 80%",
    });
    gsap.set(steam, { opacity: 0 });
    gsap.set(steam.children, { y: 12, opacity: 0, scale: 0.85 });
    gsap.set(cook, { rotate: 0, y: 0, transformOrigin: "50% 70%" });

    const tl = gsap.timeline({ defaults: { ease: motionEases.enter } });
    timelineRef.current = tl;

    // Lid lifts off the pot and arcs to the open pose (~1s).
    tl.to(
      lid,
      {
        x: stageWidth * LID.open.x,
        y: stageHeight * LID.open.y,
        rotate: LID.open.rotate,
        duration: 1.05,
        ease: "power2.inOut",
      },
      0,
    );
    // Settle onto the painted open lid in the art.
    tl.to(lid, { opacity: 0, duration: 0.35, ease: "power1.in" }, 0.95);

    tl.to(steam, { opacity: 1, duration: 0.35 }, 0.35);
    tl.to(
      steam.children,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.9,
        stagger: 0.08,
        ease: "power1.out",
      },
      0.4,
    );
    tl.to(
      steam.children,
      {
        y: -18,
        opacity: 0.55,
        duration: 1.4,
        stagger: 0.1,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
      1.2,
    );

    tl.to(cook, { rotate: 5, y: 6, duration: 0.45, ease: "power2.out" }, 0.75);
    tl.to(
      cook,
      { rotate: -2.5, y: -4, duration: 0.4, ease: "power2.inOut" },
      1.2,
    );
    tl.to(
      cook,
      { rotate: 0, y: 0, duration: 0.55, ease: motionEases.enter },
      1.55,
    );

    tl.to(
      cook,
      {
        y: -6,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      },
      2.1,
    );
  }, []);

  useGSAP(
    () => {
      playReveal();
      return () => {
        timelineRef.current?.kill();
      };
    },
    { scope: rootRef, dependencies: [playReveal] },
  );

  return (
    <button
      ref={rootRef}
      type="button"
      onClick={playReveal}
      className="relative block h-full w-full cursor-pointer border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest"
      aria-label={
        decorative
          ? "Replay cooking reveal animation"
          : "Tiffimu cook mascot revealing a steaming pot — click to replay"
      }
    >
      <div
        ref={stageRef}
        className="relative aspect-[864/1024] h-full w-full overflow-visible"
      >
        <div ref={cookRef} className="absolute inset-0 will-change-transform">
          <Image
            src={COOK_SRC}
            alt=""
            width={864}
            height={1024}
            sizes="(max-width: 1024px) 80vw, 420px"
            className="pointer-events-none h-full w-full object-contain [filter:drop-shadow(0_12px_16px_rgba(30,52,25,0.14))]"
            priority={false}
            aria-hidden
          />
        </div>

        <div
          ref={steamRef}
          className="pointer-events-none absolute z-[1] opacity-0"
          style={{ left: "26%", top: "42%", width: "22%", height: "22%" }}
          aria-hidden
        >
          <span className="cook-steam-wisp cook-steam-wisp--a" />
          <span className="cook-steam-wisp cook-steam-wisp--b" />
          <span className="cook-steam-wisp cook-steam-wisp--c" />
        </div>

        <div
          ref={lidRef}
          className="pointer-events-none absolute top-0 left-0 z-[2] will-change-transform"
          style={{ width: `${LID.width * 100}%` }}
          aria-hidden
        >
          <Image
            src={LID_SRC}
            alt=""
            width={280}
            height={180}
            className="h-auto w-full drop-shadow-md"
            aria-hidden
          />
        </div>
      </div>
    </button>
  );
}
