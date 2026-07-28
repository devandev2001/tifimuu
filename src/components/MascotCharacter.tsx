"use client";

import Image from "next/image";
import { useReducedMotion } from "@/lib/useReducedMotion";

export type MascotVariant = "tiffin" | "cook" | "wave";

const VARIANT_SRC: Record<
  MascotVariant,
  { src: string; width: number; height: number; alt: string }
> = {
  tiffin: {
    src: "/characters/mascot-tiffin-v2.png",
    width: 301,
    height: 639,
    alt: "The Tiffimu mascot holding a three-tier tiffin carrier and a tote bag",
  },
  cook: {
    src: "/characters/cook-reveal/cook-full-v3.png",
    width: 864,
    height: 1024,
    alt: "The Tiffimu mascot lifting the lid on a steaming green pot of home-style food",
  },
  wave: {
    src: "/characters/mascot-wave-v2.png",
    width: 301,
    height: 639,
    alt: "The Tiffimu mascot waving hello with a tiffin carrier",
  },
};

type MascotCharacterProps = {
  variant?: MascotVariant;
  className?: string;
  /** Extra idle motion intensity: calm | playful */
  mood?: "calm" | "playful";
  /** Decorative: hide from accessibility tree when paired with nearby text. */
  decorative?: boolean;
  priority?: boolean;
  sizes?: string;
};

/**
 * Transparent PNG mascot with continuous idle motion (bob, sway, breathe).
 * Under prefers-reduced-motion the image stays fully static.
 */
export function MascotCharacter({
  variant = "tiffin",
  className = "",
  mood = "calm",
  decorative = false,
  priority = false,
  sizes,
}: MascotCharacterProps) {
  const reducedMotion = useReducedMotion();
  const asset = VARIANT_SRC[variant];
  const motionClass = reducedMotion
    ? ""
    : mood === "playful"
      ? "mascot-idle mascot-idle--playful"
      : "mascot-idle";

  return (
    <div className={`relative inline-block ${motionClass} ${className}`}>
      <Image
        src={asset.src}
        alt={decorative ? "" : asset.alt}
        width={asset.width}
        height={asset.height}
        priority={priority}
        sizes={sizes}
        className="h-auto w-full [filter:drop-shadow(0_12px_16px_rgba(30,52,25,0.14))]"
        aria-hidden={decorative || undefined}
      />
    </div>
  );
}
