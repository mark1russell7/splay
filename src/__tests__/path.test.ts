import { describe, it, expect } from "vitest";
import { arrayPath, objectPath, pathDepth } from "../index.js";

describe("arrayPath", () => {
  it("creates array path from parent and index", () => {
    expect(arrayPath("root", 0)).toBe("root[0]");
    expect(arrayPath("root", 5)).toBe("root[5]");
    expect(arrayPath("data.items", 2)).toBe("data.items[2]");
  });

  it("handles empty parent path", () => {
    expect(arrayPath("", 0)).toBe("[0]");
  });
});

describe("objectPath", () => {
  it("creates object path from parent and key", () => {
    expect(objectPath("root", "child")).toBe("root.child");
    expect(objectPath("data", "items")).toBe("data.items");
  });

  it("handles empty parent path", () => {
    expect(objectPath("", "root")).toBe(".root");
  });

  it("handles nested paths", () => {
    expect(objectPath("a.b.c", "d")).toBe("a.b.c.d");
  });
});

describe("pathDepth", () => {
  it("returns 1 for single segment", () => {
    expect(pathDepth("root")).toBe(1);
  });

  it("counts dot-separated segments", () => {
    expect(pathDepth("a.b")).toBe(2);
    expect(pathDepth("a.b.c")).toBe(3);
    expect(pathDepth("a.b.c.d.e")).toBe(5);
  });

  it("handles empty path", () => {
    expect(pathDepth("")).toBe(1);
  });

  it("does not count array brackets as depth", () => {
    // Array brackets are part of the segment, not separate depth
    expect(pathDepth("items[0]")).toBe(1);
    expect(pathDepth("data.items[0]")).toBe(2);
  });
});
