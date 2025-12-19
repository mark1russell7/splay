import { describe, it, expect } from "vitest";
import { gridLayout, listLayout, splitLayout } from "../index.js";

describe("gridLayout", () => {
  it("creates grid items with correct positions", () => {
    const container = { width: 300, height: 200 };
    const items = gridLayout(container, 6, 3, 50);

    expect(items).toHaveLength(6);

    // First row
    expect(items[0]).toEqual({ index: 0, pos: { x: 0, y: 0 }, size: { width: 100, height: 50 } });
    expect(items[1]).toEqual({ index: 1, pos: { x: 100, y: 0 }, size: { width: 100, height: 50 } });
    expect(items[2]).toEqual({ index: 2, pos: { x: 200, y: 0 }, size: { width: 100, height: 50 } });

    // Second row
    expect(items[3]).toEqual({ index: 3, pos: { x: 0, y: 50 }, size: { width: 100, height: 50 } });
    expect(items[4]).toEqual({ index: 4, pos: { x: 100, y: 50 }, size: { width: 100, height: 50 } });
    expect(items[5]).toEqual({ index: 5, pos: { x: 200, y: 50 }, size: { width: 100, height: 50 } });
  });

  it("handles empty grid", () => {
    const container = { width: 300, height: 200 };
    const items = gridLayout(container, 0, 3, 50);
    expect(items).toHaveLength(0);
  });

  it("handles single column", () => {
    const container = { width: 200, height: 300 };
    const items = gridLayout(container, 3, 1, 40);

    expect(items[0].pos).toEqual({ x: 0, y: 0 });
    expect(items[1].pos).toEqual({ x: 0, y: 40 });
    expect(items[2].pos).toEqual({ x: 0, y: 80 });
    expect(items[0].size.width).toBe(200);
  });
});

describe("listLayout", () => {
  it("creates list items with correct positions", () => {
    const container = { width: 400, height: 600 };
    const items = listLayout(container, 4, 50);

    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({ index: 0, pos: { x: 0, y: 0 }, size: { width: 400, height: 50 } });
    expect(items[1]).toEqual({ index: 1, pos: { x: 0, y: 50 }, size: { width: 400, height: 50 } });
    expect(items[2]).toEqual({ index: 2, pos: { x: 0, y: 100 }, size: { width: 400, height: 50 } });
    expect(items[3]).toEqual({ index: 3, pos: { x: 0, y: 150 }, size: { width: 400, height: 50 } });
  });

  it("handles empty list", () => {
    const container = { width: 400, height: 600 };
    const items = listLayout(container, 0, 50);
    expect(items).toHaveLength(0);
  });

  it("uses full container width", () => {
    const container = { width: 500, height: 300 };
    const items = listLayout(container, 2, 30);

    expect(items[0].size.width).toBe(500);
    expect(items[1].size.width).toBe(500);
  });
});

describe("splitLayout", () => {
  it("splits container with default ratio", () => {
    const container = { width: 1000, height: 600 };
    const { left, right } = splitLayout(container);

    expect(left.width).toBe(300);
    expect(left.height).toBe(600);
    expect(right.width).toBe(700);
    expect(right.height).toBe(600);
  });

  it("splits container with custom ratio", () => {
    const container = { width: 1000, height: 600 };
    const { left, right } = splitLayout(container, 0.5);

    expect(left.width).toBe(500);
    expect(right.width).toBe(500);
  });

  it("handles 0 ratio", () => {
    const container = { width: 1000, height: 600 };
    const { left, right } = splitLayout(container, 0);

    expect(left.width).toBe(0);
    expect(right.width).toBe(1000);
  });

  it("handles 1 ratio", () => {
    const container = { width: 1000, height: 600 };
    const { left, right } = splitLayout(container, 1);

    expect(left.width).toBe(1000);
    expect(right.width).toBe(0);
  });
});
