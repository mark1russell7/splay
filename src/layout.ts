import type { Size, Position } from "./types.js";

export interface LayoutItem {
  pos: Position;
  size: Size;
  index: number;
}

export function gridLayout(
  container: Size,
  count: number,
  cols: number,
  rowHeight: number
): LayoutItem[] {
  const itemWidth = container.width / cols;
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    pos: { x: (i % cols) * itemWidth, y: Math.floor(i / cols) * rowHeight },
    size: { width: itemWidth, height: rowHeight },
  }));
}

export function listLayout(
  container: Size,
  count: number,
  itemHeight: number
): LayoutItem[] {
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    pos: { x: 0, y: i * itemHeight },
    size: { width: container.width, height: itemHeight },
  }));
}

export function splitLayout(
  container: Size,
  ratio = 0.3
): { left: Size; right: Size } {
  return {
    left: { width: container.width * ratio, height: container.height },
    right: { width: container.width * (1 - ratio), height: container.height },
  };
}
