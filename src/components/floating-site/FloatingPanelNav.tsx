"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useFloatingSite } from "./FloatingSiteProvider";

export function FloatingPanelNav() {
  const { index, count, goTo, next, prev, panels } = useFloatingSite();
  const reducedMotion = useReducedMotion();

  return (
    <>
      <nav
        aria-label="Landing panels"
        className="pointer-events-auto absolute top-1/2 right-3 z-30 hidden -translate-y-1/2 flex-col items-center gap-2.5 sm:right-5 lg:flex"
      >
        {panels.map((panel, panelIndex) => {
          const active = panelIndex === index;
          return (
            <button
              key={panel.id}
              type="button"
              aria-label={`${panel.eyebrow}: ${panel.title}`}
              aria-current={active ? "true" : undefined}
              onClick={() => goTo(panelIndex)}
              className={`rounded-full transition-[width,height,background-color] duration-(--motion-duration-base) ease-(--motion-ease-standard) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                active
                  ? "h-8 w-2.5 bg-forest"
                  : "h-2.5 w-2.5 bg-forest/25 hover:bg-forest/50"
              }`}
            />
          );
        })}
      </nav>

      <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-30 flex items-center justify-center gap-3 px-4 sm:bottom-6">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          aria-label="Previous panel"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest/15 bg-cream/85 text-forest shadow-sm backdrop-blur-sm transition-opacity disabled:opacity-35"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ↑
          </span>
        </button>
        <p className="min-w-16 text-center font-display text-sm font-bold tracking-wide text-forest/70">
          {String(index + 1).padStart(2, "0")}
          <span className="mx-1 text-forest/30">/</span>
          {String(count).padStart(2, "0")}
        </p>
        <button
          type="button"
          onClick={next}
          disabled={index === count - 1}
          aria-label="Next panel"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-forest/15 bg-cream/85 text-forest shadow-sm backdrop-blur-sm transition-opacity disabled:opacity-35"
        >
          <span aria-hidden="true" className="text-lg leading-none">
            ↓
          </span>
        </button>
      </div>

      {index === 0 && !reducedMotion ? (
        <motion.p
          aria-hidden="true"
          className="pointer-events-none absolute bottom-20 left-1/2 z-20 hidden -translate-x-1/2 text-xs font-bold tracking-[0.18em] text-olive/70 uppercase sm:block"
          animate={{ opacity: [0.35, 0.85, 0.35], y: [0, 4, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          Scroll or swipe
        </motion.p>
      ) : null}
    </>
  );
}
