import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  splashStepCount,
  splashWalkStartX,
  splashMotion,
} from "./motion.ts";

describe("splashWalkStartX", () => {
  it("starts far enough left to clear a phone viewport", () => {
    assert.equal(splashWalkStartX(390), -Math.round(390 * 0.78));
  });

  it("caps the travel distance on very wide screens", () => {
    assert.equal(splashWalkStartX(2400), -980);
  });

  it("never returns a non-negative offset", () => {
    assert.ok(splashWalkStartX(320) < 0);
    assert.ok(splashWalkStartX(1440) < 0);
  });
});

describe("splashStepCount", () => {
  it("returns enough steps for a readable walk cycle", () => {
    assert.ok(splashStepCount() >= 5);
    assert.equal(
      splashStepCount(splashMotion.walkDuration, splashMotion.stepPeriod),
      Math.max(
        5,
        Math.round(splashMotion.walkDuration / splashMotion.stepPeriod),
      ),
    );
  });
});
