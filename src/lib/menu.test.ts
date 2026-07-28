import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getKuwaitMenuDayId } from "./menu.ts";

describe("getKuwaitMenuDayId", () => {
  it("skips friday", () => {
    assert.equal(getKuwaitMenuDayId(new Date("2026-07-24T12:00:00+03:00")), null);
  });

  it("maps monday in kuwait", () => {
    assert.equal(
      getKuwaitMenuDayId(new Date("2026-07-27T12:00:00+03:00")),
      "monday",
    );
  });
});
