"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { TiffinPoster } from "./TiffinPoster";

/* WebGL support never changes during a session, so probe once and cache. */
let webglProbeResult: boolean | null = null;

function getWebglSnapshot(): boolean {
  if (webglProbeResult === null) {
    const probe = document.createElement("canvas");
    webglProbeResult = Boolean(
      probe.getContext("webgl2") ?? probe.getContext("webgl"),
    );
  }
  return webglProbeResult;
}

function subscribeToNothing(): () => void {
  return () => {};
}

const TiffinScene = dynamic(
  () => import("./TiffinScene").then((module) => module.TiffinScene),
  { ssr: false, loading: () => <TiffinPoster /> },
);

class SceneErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Client boundary for the 3D hero. Decides between:
 * - the static poster (reduced motion, no WebGL, load failure), and
 * - the lazy-loaded interactive canvas (paused when off-screen or via
 *   the pause button, per WCAG 2.2.2).
 */
type TiffinSceneShellProps = {
  className?: string;
  controlsClassName?: string;
  showControls?: boolean;
};

export function TiffinSceneShell({
  className,
  controlsClassName,
  showControls = true,
}: TiffinSceneShellProps = {}) {
  const reducedMotion = useReducedMotion();
  const webglSupported = useSyncExternalStore(
    subscribeToNothing,
    getWebglSnapshot,
    () => false,
  );
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const showScene = webglSupported && !reducedMotion;

  useEffect(() => {
    if (!showScene) return;
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "80px" },
    );
    observer.observe(stage);
    return () => observer.disconnect();
  }, [showScene]);

  if (!showScene) {
    return (
      <div className={cn("mx-auto aspect-square w-full max-w-130", className)}>
        <TiffinPoster />
      </div>
    );
  }

  return (
    <div
      ref={stageRef}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-130",
        className,
      )}
    >
      {/* Decorative scene: all information also exists as page text. */}
      <div className="absolute inset-0" aria-hidden="true">
        <SceneErrorBoundary fallback={<TiffinPoster />}>
          <TiffinScene animate={inView && !paused} />
        </SceneErrorBoundary>
      </div>
      {showControls ? (
        <button
          type="button"
          onClick={() => setPaused((wasPaused) => !wasPaused)}
          aria-pressed={paused}
          className={cn(
            "absolute right-2 bottom-2 flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full bg-forest px-4 text-sm font-bold text-cream transition-colors duration-(--motion-duration-fast) hover:bg-forest-deep",
            controlsClassName,
          )}
        >
          {paused ? (
            <svg
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M4 2.5v11l9-5.5-9-5.5Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 16 16"
              className="size-3.5"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M3.5 2h3v12h-3V2Zm6 0h3v12h-3V2Z" />
            </svg>
          )}
          {paused ? "Play" : "Pause"}
          <span className="sr-only"> 3D tiffin animation</span>
        </button>
      ) : null}
    </div>
  );
}
