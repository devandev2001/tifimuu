"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ReactNode } from "react";
import {
  MascotCharacter,
  type MascotVariant,
} from "@/components/MascotCharacter";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { MascotEvent } from "@/lib/mascot-events";

const MascotRiveCanvas = dynamic(
  () =>
    import("./MascotRiveCanvas").then((module) => module.MascotRiveCanvas),
  { ssr: false },
);

let riveAssetPromise: Promise<boolean> | null = null;

function checkRiveAsset(): Promise<boolean> {
  if (!riveAssetPromise) {
    riveAssetPromise = fetch("/rive/mascot.riv", {
      method: "HEAD",
      cache: "no-store",
    })
      .then((response) => response.ok)
      .catch(() => false);
  }
  return riveAssetPromise;
}

class RiveErrorBoundary extends Component<
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

type MascotRiveProps = {
  event: MascotEvent;
  eventSequence: number;
  fallbackVariant?: MascotVariant;
  decorative?: boolean;
  className?: string;
};

export function MascotRive({
  event,
  eventSequence,
  fallbackVariant = "wave",
  decorative = false,
  className = "",
}: MascotRiveProps) {
  const reducedMotion = useReducedMotion();
  const [riveAvailable, setRiveAvailable] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;
    let active = true;
    void checkRiveAsset().then((available) => {
      if (active) setRiveAvailable(available);
    });
    return () => {
      active = false;
    };
  }, [reducedMotion]);

  const fallback = (
    <MascotCharacter
      variant={fallbackVariant}
      mood={reducedMotion ? "calm" : "playful"}
      decorative={decorative}
      className="h-full w-full object-contain"
      sizes="(max-width: 768px) 45vw, 240px"
    />
  );

  return (
    <div className={className}>
      {riveAvailable && !reducedMotion ? (
        <RiveErrorBoundary fallback={fallback}>
          <MascotRiveCanvas
            event={event}
            eventSequence={eventSequence}
            decorative={decorative}
          />
        </RiveErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
