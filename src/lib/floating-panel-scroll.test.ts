import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getPanelScrollState,
  shouldNavigateFromScrollGesture,
  type PanelScrollState,
} from "./floating-panel-scroll.ts";

describe("shouldNavigateFromScrollGesture", () => {
  const noScroll: PanelScrollState = {
    element: null,
    canScroll: false,
    atTop: true,
    atBottom: true,
  };

  it("navigates when the panel cannot scroll", () => {
    assert.equal(shouldNavigateFromScrollGesture(noScroll, 40), true);
    assert.equal(shouldNavigateFromScrollGesture(noScroll, -40), true);
  });

  it("keeps scrolling when content has room in that direction", () => {
    const mid: PanelScrollState = {
      element: null,
      canScroll: true,
      atTop: false,
      atBottom: false,
    };
    assert.equal(shouldNavigateFromScrollGesture(mid, 40), false);
    assert.equal(shouldNavigateFromScrollGesture(mid, -40), false);
  });

  it("navigates only at the matching edge", () => {
    const atTop: PanelScrollState = {
      element: null,
      canScroll: true,
      atTop: true,
      atBottom: false,
    };
    const atBottom: PanelScrollState = {
      element: null,
      canScroll: true,
      atTop: false,
      atBottom: true,
    };

    assert.equal(shouldNavigateFromScrollGesture(atTop, -40), true);
    assert.equal(shouldNavigateFromScrollGesture(atTop, 40), false);
    assert.equal(shouldNavigateFromScrollGesture(atBottom, 40), true);
    assert.equal(shouldNavigateFromScrollGesture(atBottom, -40), false);
  });
});

describe("getPanelScrollState", () => {
  it("returns non-scrollable defaults when no root exists", () => {
    assert.deepEqual(getPanelScrollState(null), {
      element: null,
      canScroll: false,
      atTop: true,
      atBottom: true,
    });
  });
});
