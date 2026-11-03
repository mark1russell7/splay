import { inferType, TYPE_SYMBOL } from "@mark1russell7/splay";
import { describe, expect, it } from "vitest";
import { PRESETS, read } from "./data.ts";

describe("read", () => {
  it("reads $date as a Date and $type as TYPE_SYMBOL", () => {
    const result = read('{"d": {"$date": "2026-11-03"}, "m": {"$type": "money", "amount": 1, "currency": "EUR"}}');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const value = result.value as { d: unknown; m: Record<string | symbol, unknown> };
    expect(inferType(value.d)).toBe("date");
    expect(inferType(value.m)).toBe("money");
    expect(value.m[TYPE_SYMBOL]).toBe("money");
    expect(Object.keys(value.m)).toEqual(["amount", "currency"]);
  });

  it("keeps an object with a $date that is not a date", () => {
    const result = read('{"$date": "no"}');
    expect(result.ok && inferType(result.value)).toBe("object");
  });

  it("gives the error of invalid JSON", () => {
    const result = read("{");
    expect(result.ok).toBe(false);
  });

  it("reads each preset", () => {
    expect(PRESETS.map((p) => read(p.json).ok)).toEqual(PRESETS.map(() => true));
  });
});
