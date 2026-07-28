/**
 * JavaScript motion tokens for GSAP, Framer Motion, and R3F.
 *
 * The CSS custom properties in src/app/globals.css are the source of
 * truth for durations/easing; keep these values in sync when editing.
 * Durations here are in seconds (GSAP / Framer convention).
 */
export const motionDurations = {
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  narrative: 0.7,
} as const;

export const motionEases = {
  /** Matches --motion-ease-standard for ordinary state changes. */
  standard: "power2.out",
  /** Matches --motion-ease-enter for elements decelerating into view. */
  enter: "power3.out",
  /** Scrubbed scroll timelines should track the scrollbar linearly. */
  scrub: "none",
} as const;

export const motionDistances = {
  sm: 8,
  md: 16,
  lg: 32,
  hoverLift: 6,
  magnetic: 28,
  tilt: 8,
} as const;

/** Framer Motion spring presets (shared across primitives). */
export const motionSprings = {
  snappy: { type: "spring" as const, stiffness: 420, damping: 28 },
  soft: { type: "spring" as const, stiffness: 180, damping: 22 },
  magnetic: { type: "spring" as const, stiffness: 260, damping: 18, mass: 0.4 },
} as const;

/** 3D hero tuning: one owner (useFrame) for every scene transform. */
export const tiffinMotion = {
  idleSpinRadPerSec: 0.35,
  bobAmplitude: 0.05,
  bobFrequency: 1.1,
  pointerTiltX: 0.16,
  pointerTiltZ: 0.12,
  /** Damping factor for THREE.MathUtils.damp toward the pointer target. */
  damping: 4,
} as const;

/**
 * Opening splash — walk in → brand name → turn to face you → tagline.
 * Rive Welcome is ~3.0s, Turn ~0.8s; keep HTML timings in the same spirit.
 * Durations in seconds except *Ms fields.
 */
export const splashMotion = {
  walkDuration: 2.4,
  /** Time each walk-cycle PNG is shown (8 frames ≈ 10 fps). */
  walkFramePeriod: 0.1,
  stepPeriod: 0.4,
  stepLift: 8,
  stepSquash: 0.98,
  stepStretch: 1.015,
  stepLean: 2,
  /** Side → front face turn (the beat before the tagline). */
  turnDuration: 0.85,
  /** Pause after “Tiffin Made For You” so it can be read. */
  holdAfterTagline: 1.15,
  /** Rive: wordmark while Welcome settles (before Turn). */
  riveWordmarkAt: 2.45,
  /** Rive: tagline mid-Turn as she faces the camera. */
  riveTaglineAt: 3.25,
  /** Rive: total Welcome + Turn before site handoff begins. */
  riveSequenceMs: 4200,
  reducedHoldMs: 480,
  imageReadyFallbackMs: 2200,
  letterStagger: 0.045,
  taglineStagger: 0.028,
} as const;

/** Off-screen start for the splash walker (pixels left of rest position). */
export function splashWalkStartX(viewportWidth: number): number {
  return -Math.round(Math.min(Math.max(viewportWidth, 320) * 0.78, 980));
}

/** How many full footsteps fit in the walk. */
export function splashStepCount(
  walkDuration = splashMotion.walkDuration,
  stepPeriod = splashMotion.stepPeriod,
): number {
  return Math.max(5, Math.round(walkDuration / stepPeriod));
}
