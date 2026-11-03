// The model of the layout panel: the call of a layout helper, its boxes and the note under the stage. It uses no DOM.
import { gridLayout, listLayout, splitLayout, type LayoutItem, type Size } from "@mark1russell7/splay";

export type LayoutKind = "grid" | "list" | "split";

/** The settings of the panel. */
export interface LayoutSettings {
  readonly kind: LayoutKind;
  readonly width: number;
  readonly height: number;
  readonly count: number;
  readonly cols: number;
  readonly row: number;
  readonly ratio: number;
}

/** One box of the stage, with its label. */
export interface Box extends LayoutItem {
  readonly label: string;
  /** This value is true when the box goes past the bottom of the container. */
  readonly out: boolean;
}

/** The result of a layout: the code of the call, the boxes and a note. */
export interface LayoutResult {
  readonly code: string;
  readonly boxes: readonly Box[];
  readonly note: string;
}

const num = (n: number): string => String(Math.round(n * 10) / 10);
const dims = (s: Size): string => `${num(s.width)} × ${num(s.height)}`;

/** This function calls the helper of `kind` with the settings, and gives the boxes that the stage draws. */
export function layout(s: LayoutSettings): LayoutResult {
  const container: Size = { width: s.width, height: s.height };
  const arg = `{ width: ${num(s.width)}, height: ${num(s.height)} }`;
  const boxes = (items: readonly LayoutItem[]): Box[] =>
    items.map((item) => ({ ...item, label: String(item.index), out: item.pos.y + item.size.height > s.height + 0.01 }));
  const past = (all: readonly Box[]): string => {
    const n = all.filter((b) => b.out).length;
    return n === 0 ? "All boxes fit in the container." : `${n} of ${all.length} boxes go past the bottom: the helpers do not clip.`;
  };
  if (s.kind === "grid") {
    const all = boxes(gridLayout(container, s.count, s.cols, s.row));
    const rows = Math.ceil(s.count / s.cols);
    return {
      code: `gridLayout(${arg}, ${s.count}, ${s.cols}, ${s.row})`,
      boxes: all,
      note: `${s.count} boxes of ${dims({ width: s.width / s.cols, height: s.row })} in ${rows} ${rows === 1 ? "row" : "rows"}. ${past(all)}`,
    };
  }
  if (s.kind === "list") {
    const all = boxes(listLayout(container, s.count, s.row));
    return {
      code: `listLayout(${arg}, ${s.count}, ${s.row})`,
      boxes: all,
      note: `${s.count} boxes of ${dims({ width: s.width, height: s.row })}, one below the other. ${past(all)}`,
    };
  }
  const { left, right } = splitLayout(container, s.ratio);
  return {
    code: `splitLayout(${arg}, ${num(s.ratio)})`,
    boxes: [
      { index: 0, label: "left", pos: { x: 0, y: 0 }, size: left, out: false },
      { index: 1, label: "right", pos: { x: left.width, y: 0 }, size: right, out: false },
    ],
    note: `left is ${dims(left)}, right is ${dims(right)}. splitLayout gives sizes only, so the stage puts right next to left.`,
  };
}
