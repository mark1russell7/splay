import { describe, it, expect } from "vitest";
import { inferType, TYPE_SYMBOL } from "../index.js";

describe("inferType", () => {
  it("returns 'null' for null", () => {
    expect(inferType(null)).toBe("null");
  });

  it("returns 'undefined' for undefined", () => {
    expect(inferType(undefined)).toBe("undefined");
  });

  it("returns 'string' for strings", () => {
    expect(inferType("hello")).toBe("string");
    expect(inferType("")).toBe("string");
  });

  it("returns 'number' for numbers", () => {
    expect(inferType(42)).toBe("number");
    expect(inferType(0)).toBe("number");
    expect(inferType(-1.5)).toBe("number");
    expect(inferType(NaN)).toBe("number");
    expect(inferType(Infinity)).toBe("number");
  });

  it("returns 'boolean' for booleans", () => {
    expect(inferType(true)).toBe("boolean");
    expect(inferType(false)).toBe("boolean");
  });

  it("returns 'function' for functions", () => {
    expect(inferType(() => {})).toBe("function");
    expect(inferType(function () {})).toBe("function");
    expect(inferType(async () => {})).toBe("function");
  });

  it("returns 'array' for arrays", () => {
    expect(inferType([])).toBe("array");
    expect(inferType([1, 2, 3])).toBe("array");
  });

  it("returns 'date' for Date instances", () => {
    expect(inferType(new Date())).toBe("date");
  });

  it("returns 'object' for plain objects", () => {
    expect(inferType({})).toBe("object");
    expect(inferType({ a: 1 })).toBe("object");
  });

  it("returns custom type from TYPE_SYMBOL", () => {
    const customValue = { [TYPE_SYMBOL]: "custom-type", data: 42 };
    expect(inferType(customValue)).toBe("custom-type");
  });

  it("prioritizes TYPE_SYMBOL over built-in types", () => {
    const customArray = Object.assign([1, 2, 3], { [TYPE_SYMBOL]: "my-list" });
    expect(inferType(customArray)).toBe("my-list");
  });
});
