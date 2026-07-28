"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSiteContent } from "@/components/content/ContentProvider";
import type { LandingPanel, LandingPanelId } from "@/lib/landing-panels";

type FloatingSiteContextValue = {
  panels: LandingPanel[];
  index: number;
  panelId: LandingPanelId;
  count: number;
  direction: 1 | -1;
  goTo: (index: number) => void;
  goToId: (id: LandingPanelId) => void;
  next: () => void;
  prev: () => void;
};

const FloatingSiteContext = createContext<FloatingSiteContextValue | null>(
  null,
);

export function FloatingSiteProvider({ children }: { children: ReactNode }) {
  const { content } = useSiteContent();
  const panels = content.panels;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const indexRef = useRef(0);
  const count = panels.length;

  useEffect(() => {
    if (indexRef.current > count - 1) {
      const nextIndex = Math.max(0, count - 1);
      indexRef.current = nextIndex;
      setIndex(nextIndex);
    }
  }, [count]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const clamped = Math.max(0, Math.min(count - 1, nextIndex));
      const current = indexRef.current;
      if (clamped === current) return;
      indexRef.current = clamped;
      setDirection(clamped > current ? 1 : -1);
      setIndex(clamped);
    },
    [count],
  );

  const goToId = useCallback(
    (id: LandingPanelId) => {
      const nextIndex = panels.findIndex((panel) => panel.id === id);
      if (nextIndex >= 0) goTo(nextIndex);
    },
    [goTo, panels],
  );

  const next = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const prev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  const safeIndex = Math.min(index, Math.max(0, count - 1));
  const panelId = panels[safeIndex]?.id ?? "welcome";

  const value = useMemo(
    () => ({
      panels,
      index: safeIndex,
      panelId,
      count,
      direction,
      goTo,
      goToId,
      next,
      prev,
    }),
    [
      panels,
      safeIndex,
      panelId,
      count,
      direction,
      goTo,
      goToId,
      next,
      prev,
    ],
  );

  return (
    <FloatingSiteContext.Provider value={value}>
      {children}
    </FloatingSiteContext.Provider>
  );
}

export function useFloatingSite(): FloatingSiteContextValue {
  const value = useContext(FloatingSiteContext);
  if (!value) {
    throw new Error("useFloatingSite must be used within FloatingSiteProvider");
  }
  return value;
}

/** Returns null outside the floating landing (e.g. /floating scroll preview). */
export function useOptionalFloatingSite(): FloatingSiteContextValue | null {
  return useContext(FloatingSiteContext);
}
