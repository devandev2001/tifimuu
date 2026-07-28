"use client";

import { useCallback, useState } from "react";
import { MascotRive } from "@/components/adventure/MascotRive";
import type { MascotEvent } from "@/lib/mascot-events";
import type { MascotVariant } from "@/components/MascotCharacter";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/utils";

type InteractiveMascotProps = {
  /** Still-image fallback when Rive is unavailable or motion is reduced. */
  variant?: MascotVariant;
  className?: string;
  decorative?: boolean;
  /** Starting Rive trigger. Defaults to IDLE for looping presence. */
  initialEvent?: MascotEvent;
  /** Event fired on click / keyboard activate. Defaults to WELCOME. */
  interactEvent?: MascotEvent;
};

/**
 * Site-wide interactive Tiffimu character.
 * Uses the Rive mascot when available; falls back to the PNG still.
 * Click or press Enter / Space to replay a friendly reaction.
 */
export function InteractiveMascot({
  variant = "wave",
  className = "",
  decorative = false,
  initialEvent = "IDLE",
  interactEvent = "WELCOME",
}: InteractiveMascotProps) {
  const reducedMotion = useReducedMotion();
  const [event, setEvent] = useState<MascotEvent>(initialEvent);
  const [eventSequence, setEventSequence] = useState(0);

  const playInteraction = useCallback(() => {
    if (reducedMotion) return;
    setEvent(interactEvent);
    setEventSequence((sequence) => sequence + 1);
  }, [interactEvent, reducedMotion]);

  const interactive = !reducedMotion && !decorative;

  return (
    <div
      className={cn("relative", className)}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={
        interactive ? "Play Tiffimu mascot animation" : undefined
      }
      onClick={interactive ? playInteraction : undefined}
      onKeyDown={
        interactive
          ? (keyboardEvent) => {
              if (
                keyboardEvent.key === "Enter" ||
                keyboardEvent.key === " "
              ) {
                keyboardEvent.preventDefault();
                playInteraction();
              }
            }
          : undefined
      }
    >
      <MascotRive
        event={event}
        eventSequence={eventSequence}
        fallbackVariant={variant}
        decorative={decorative || interactive}
        className="h-full w-full"
      />
    </div>
  );
}
