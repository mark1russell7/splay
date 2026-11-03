import { describe, expect, it } from "vitest";
import { layout } from "./layout.ts";

const base = { width: 480, height: 200, count: 10, cols: 4, row: 48, ratio: 0.3 };

describe("layout", () => {
  it("gives the boxes of gridLayout and marks the boxes past the bottom", () => {
    const result = layout({ ...base, kind: "grid" });
    expect(result.code).toBe("gridLayout({ width: 480, height: 200 }, 10, 4, 48)");
    expect(result.boxes).toHaveLength(10);
    expect(result.boxes[5]).toMatchObject({ pos: { x: 120, y: 48 }, size: { width: 120, height: 48 }, out: false });
    expect(layout({ ...base, kind: "grid", row: 80 }).boxes.filter((b) => b.out).map((b) => b.index)).toEqual([8, 9]);
  });

  it("gives the boxes of listLayout", () => {
    const result = layout({ ...base, kind: "list", count: 3 });
    expect(result.boxes.map((b) => b.pos.y)).toEqual([0, 48, 96]);
    expect(result.note).toContain("All boxes fit");
  });

  it("gives the two sizes of splitLayout", () => {
    const result = layout({ ...base, kind: "split" });
    expect(result.boxes.map((b) => b.size.width)).toEqual([144, 336]);
    expect(result.boxes[1]?.pos.x).toBe(144);
  });
});
