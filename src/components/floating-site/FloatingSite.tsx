"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { motionDurations } from "@/lib/motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { FloatingPanel } from "./FloatingPanel";
import { FloatingMenuPanel } from "./FloatingMenuPanel";
import { FloatingPlansPanel } from "./FloatingPlansPanel";
import { FloatingWhyPanel } from "./FloatingWhyPanel";
import { FloatingStoryPanel } from "./FloatingStoryPanel";
import { FloatingPanelNav } from "./FloatingPanelNav";
import { useFloatingSite } from "./FloatingSiteProvider";

/**
 * Full-viewport floating landing — visual panels with Framer enter motion.
 */
export function FloatingSite() {
  const { index, next, prev, goTo, panels, panelId } = useFloatingSite();
  const reducedMotion = useReducedMotion();
  const lockRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const allowWheelNav =
    panelId !== "menu" &&
    panelId !== "plans" &&
    panelId !== "why" &&
    panelId !== "story";

  const withLock = useCallback((action: () => void) => {
    if (lockRef.current) return;
    lockRef.current = true;
    action();
    window.setTimeout(() => {
      lockRef.current = false;
    }, reducedMotion ? 220 : 720);
  }, [reducedMotion]);

  useEffect(() => {
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        withLock(next);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        withLock(prev);
      } else if (event.key === "Home") {
        event.preventDefault();
        withLock(() => goTo(0));
      } else if (event.key === "End") {
        event.preventDefault();
        withLock(() => goTo(panels.length - 1));
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, next, panels.length, prev, withLock]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!allowWheelNav) return;
      if (Math.abs(event.deltaY) < 18) return;
      event.preventDefault();
      if (event.deltaY > 0) withLock(next);
      else withLock(prev);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [allowWheelNav, next, prev, withLock]);

  const onTouchStart = (event: React.TouchEvent) => {
    touchStartY.current = event.touches[0]?.clientY ?? null;
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    if (!allowWheelNav) return;
    const start = touchStartY.current;
    touchStartY.current = null;
    if (start == null) return;
    const end = event.changedTouches[0]?.clientY;
    if (end == null) return;
    const delta = start - end;
    if (Math.abs(delta) < 56) return;
    if (delta > 0) withLock(next);
    else withLock(prev);
  };

  const panel = panels[index];
  if (!panel) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Tiffimu floating landing"
      className="floating-site relative h-[calc(100svh-4.5rem)] overflow-hidden bg-pistachio"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_72%_28%,rgba(250,246,234,0.95)_0%,rgba(223,240,184,0.72)_38%,rgba(203,232,151,0.35)_62%,transparent_78%)]"
      />
      <div
        aria-hidden="true"
        className="floating-site-orb absolute top-[12%] left-[8%] h-40 w-40 rounded-full bg-cream/40 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="floating-site-orb-slow absolute right-[12%] bottom-[18%] h-52 w-52 rounded-full bg-lime/30 blur-3xl"
      />

      <div className="relative h-full">
        <motion.div
          key={panel.id}
          role="group"
          aria-roledescription="slide"
          aria-label={`${panel.eyebrow}: ${panel.title}`}
          data-panel-id={panel.id}
          data-panel-index={index}
          initial={reducedMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: motionDurations.slow,
                  ease: [0.16, 1, 0.3, 1],
                }
          }
          className="absolute inset-0 will-change-transform"
        >
          {panel.id === "menu" ? (
            <FloatingMenuPanel isActive />
          ) : panel.id === "plans" ? (
            <FloatingPlansPanel isActive />
          ) : panel.id === "why" ? (
            <FloatingWhyPanel isActive />
          ) : panel.id === "story" ? (
            <FloatingStoryPanel isActive />
          ) : (
            <FloatingPanel
              panel={panel}
              isActive
              priorityImage={panel.id === "welcome"}
            />
          )}
        </motion.div>
      </div>

      <FloatingPanelNav />
    </section>
  );
}
