import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizePointerPosition } from "./floating-hero.ts";

describe("normalizePointerPosition", () => {
  const bounds = { left: 100, top: 50, width: 800, height: 400 };

  it("maps the center of the stage to a neutral position", () => {
    assert.deepEqual(normalizePointerPosition(500, 250, bounds), {
      x: 0,
      y: 0,
    });
  });

  it("maps stage edges to the full parallax range", () => {
    assert.deepEqual(normalizePointerPosition(100, 50, bounds), {
      x: -1,
      y: -1,
    });
    assert.deepEqual(normalizePointerPosition(900, 450, bounds), {
      x: 1,
      y: 1,
    });
  });

  it("clamps pointer positions outside the stage", () => {
    assert.deepEqual(normalizePointerPosition(-500, 900, bounds), {
      x: -1,
      y: 1,
    });
  });
});
