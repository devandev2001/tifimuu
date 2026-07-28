"use client";

import Image from "next/image";
import { forwardRef, useCallback, useRef } from "react";

/** 8-frame side walk cycle (pose change — legs/arms move). */
export const SPLASH_WALK_FRAMES = [
  "/characters/walk/walk_00.png",
  "/characters/walk/walk_01.png",
  "/characters/walk/walk_02.png",
  "/characters/walk/walk_03.png",
  "/characters/walk/walk_04.png",
  "/characters/walk/walk_05.png",
  "/characters/walk/walk_06.png",
  "/characters/walk/walk_07.png",
] as const;

type WalkingMascotProps = {
  onSideReady: () => void;
  onFrontReady: () => void;
  className?: string;
};

/**
 * Dual-pose mascot for splash:
 * - side walk flipbook (legs/arms change pose while GSAP carries X)
 * - front present (faces user after the walk)
 * GSAP owns travel / frame opacity / turn / shadow / dust via data-* hooks.
 */
export const WalkingMascot = forwardRef<HTMLDivElement, WalkingMascotProps>(
  function WalkingMascot({ onSideReady, onFrontReady, className = "" }, ref) {
    const sideReadyRef = useRef(false);
    const markSideReady = useCallback(() => {
      if (sideReadyRef.current) return;
      sideReadyRef.current = true;
      onSideReady();
    }, [onSideReady]);

    return (
      <div
        ref={ref}
        data-splash-walker
        className={`relative w-[min(42vw,220px)] shrink-0 [perspective:900px] will-change-transform sm:w-[240px] ${className}`}
      >
        <div
          data-splash-shadow
          aria-hidden
          className="pointer-events-none absolute bottom-[1%] left-1/2 z-0 h-4 w-[70%] -translate-x-1/2 rounded-[100%] bg-forest/25 blur-[3px] will-change-transform"
        />

        <div
          data-splash-body
          className="relative z-10 origin-[50%_100%] will-change-transform [transform-style:preserve-3d]"
        >
          <div
            data-splash-turn
            className="relative will-change-transform [transform-style:preserve-3d]"
          >
            <div
              data-splash-pose="side"
              className="relative will-change-transform"
            >
              {SPLASH_WALK_FRAMES.map((src, index) => (
                <div
                  key={src}
                  data-splash-walk-frame={index}
                  className={
                    index === 0
                      ? "relative will-change-[opacity] opacity-100"
                      : "absolute inset-0 will-change-[opacity] opacity-0"
                  }
                >
                  <Image
                    src={src}
                    alt=""
                    width={519}
                    height={900}
                    priority={index < 2}
                    sizes="(max-width: 640px) 42vw, 240px"
                    className="relative h-auto w-full drop-shadow-[0_18px_28px_rgba(34,48,31,0.2)]"
                    aria-hidden
                    onLoad={index === 0 ? markSideReady : undefined}
                  />
                </div>
              ))}
            </div>

            <div
              data-splash-pose="front"
              className="absolute inset-0 opacity-0 will-change-[opacity,transform]"
            >
              <Image
                src="/characters/mascot-tiffin-v2.png"
                alt=""
                width={302}
                height={640}
                priority
                sizes="(max-width: 640px) 42vw, 240px"
                className="relative h-auto w-full drop-shadow-[0_18px_28px_rgba(34,48,31,0.2)]"
                aria-hidden
                onLoad={onFrontReady}
              />
            </div>
          </div>
        </div>

        <div
          data-splash-dust-layer
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[3%] z-20 h-10"
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <span
              key={index}
              data-splash-dust
              className="absolute bottom-0 left-1/2 size-2.5 -translate-x-1/2 rounded-full bg-forest/30 opacity-0 will-change-transform"
              style={{ marginLeft: `${(index - 2) * 7}px` }}
            />
          ))}
        </div>
      </div>
    );
  },
);
