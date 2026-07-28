export type PointerBounds = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function clampToUnitRange(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

/**
 * Converts a pointer position inside a stage to a stable -1..1 range.
 * Values remain clamped when the pointer leaves the stage during a drag.
 */
export function normalizePointerPosition(
  clientX: number,
  clientY: number,
  bounds: PointerBounds,
) {
  const x = ((clientX - bounds.left) / bounds.width) * 2 - 1;
  const y = ((clientY - bounds.top) / bounds.height) * 2 - 1;

  return {
    x: clampToUnitRange(x),
    y: clampToUnitRange(y),
  };
}
