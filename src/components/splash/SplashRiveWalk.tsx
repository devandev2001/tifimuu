"use client";

import { useEffect, useRef } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-canvas";

const STATE_MACHINE = "Mascot";

import { splashMotion } from "@/lib/motion";

/** Welcome (~3s) + Turn (~0.8s); brand text is timed in BrandSplash. */
const WELCOME_SEQUENCE_MS = splashMotion.riveSequenceMs;

type SplashRiveWalkProps = {
  onReady?: () => void;
  onComplete: () => void;
  onUnavailable: () => void;
  className?: string;
};

/**
 * Plays mascot.riv WELCOME on artboard Main / SM Mascot.
 * Sequence: walk in from off-left → ease stop left of logo → turn → idle.
 * Falls back via onUnavailable if the riv never paints.
 */
export function SplashRiveWalk({
  onReady,
  onComplete,
  onUnavailable,
  className = "h-full w-full",
}: SplashRiveWalkProps) {
  const completedRef = useRef(false);
  const readyRef = useRef(false);
  const unavailableRef = useRef(false);
  const firedWelcomeRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { rive, RiveComponent } = useRive({
    src: "/rive/mascot.riv",
    artboard: "Main",
    stateMachines: STATE_MACHINE,
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.CenterLeft,
    }),
    onLoadError: () => {
      if (unavailableRef.current) return;
      unavailableRef.current = true;
      onUnavailable();
    },
  });

  const welcome = useStateMachineInput(rive, STATE_MACHINE, "WELCOME");

  const syncCanvasSize = () => {
    const canvas = containerRef.current?.querySelector("canvas");
    if (!(canvas instanceof HTMLCanvasElement)) return;
    canvas.style.setProperty("width", "100%", "important");
    canvas.style.setProperty("height", "100%", "important");
    canvas.style.setProperty("display", "block", "important");
    canvas.style.minWidth = "100%";
    canvas.style.minHeight = "100%";
    try {
      rive?.resizeDrawingSurfaceToCanvas();
    } catch {
      // ignore resize races during unmount
    }
  };

  useEffect(() => {
    if (!rive) return;

    syncCanvasSize();
    const raf = requestAnimationFrame(syncCanvasSize);
    const t1 = window.setTimeout(syncCanvasSize, 50);
    const t2 = window.setTimeout(syncCanvasSize, 250);

    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }

    window.addEventListener("resize", syncCanvasSize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", syncCanvasSize);
    };
    // syncCanvasSize closes over rive; re-run when rive appears
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, onReady]);

  useEffect(() => {
    if (!rive || !welcome || firedWelcomeRef.current) return;

    try {
      syncCanvasSize();
      welcome.fire();
      firedWelcomeRef.current = true;
    } catch {
      if (unavailableRef.current) return;
      unavailableRef.current = true;
      onUnavailable();
      return;
    }

    const timer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      onComplete();
    }, WELCOME_SEQUENCE_MS);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rive, welcome, onComplete, onUnavailable]);

  useEffect(() => {
    if (!rive) return;
    const timer = window.setTimeout(() => {
      try {
        const canvas = containerRef.current?.querySelector("canvas");
        if (!(canvas instanceof HTMLCanvasElement)) return;
        if (canvas.width < 2 || canvas.height < 2) {
          if (!unavailableRef.current) {
            unavailableRef.current = true;
            onUnavailable();
          }
          return;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const sample = ctx.getImageData(
          0,
          0,
          Math.min(canvas.width, 48),
          Math.min(canvas.height, 48),
        ).data;
        let opaque = 0;
        for (let i = 3; i < sample.length; i += 4) {
          if (sample[i] > 10) opaque += 1;
        }
        if (opaque === 0 && !unavailableRef.current) {
          unavailableRef.current = true;
          onUnavailable();
        }
      } catch {
        // still loading
      }
    }, 1600);
    return () => window.clearTimeout(timer);
  }, [rive, onUnavailable]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <RiveComponent
        className="absolute inset-0 block h-full w-full"
        aria-hidden
        role="img"
        aria-label="Tiffimu mascot walking in"
      />
    </div>
  );
}
