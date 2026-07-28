"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { MascotCharacter } from "@/components/MascotCharacter";

const CookRevealCanvas = dynamic(
  () =>
    import("./CookRevealCanvas").then((module) => module.CookRevealCanvas),
  { ssr: false },
);

type CookRevealMascotProps = {
  className?: string;
  decorative?: boolean;
  sizes?: string;
};

/**
 * About-section cook reveal: intact cook PNG + GSAP lid lift → steam → smell lean.
 * First paint matches the server (static cook) so hydration stays clean; the
 * animated canvas mounts after the client preference is known.
 */
export function CookRevealMascot({
  className = "",
  decorative = false,
  sizes,
}: CookRevealMascotProps) {
  const reducedMotion = useReducedMotion();
  const [allowMotion, setAllowMotion] = useState(false);

  useEffect(() => {
    setAllowMotion(!reducedMotion);
  }, [reducedMotion]);

  const fallback = (
    <MascotCharacter
      variant="cook"
      mood={allowMotion ? "playful" : "calm"}
      decorative={decorative}
      className="h-full w-full"
      sizes={sizes}
    />
  );

  return (
    <div className={className}>
      {allowMotion ? <CookRevealCanvas decorative={decorative} /> : fallback}
    </div>
  );
}
