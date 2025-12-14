export const TYPE_SYMBOL: unique symbol = Symbol.for("splay:type");

export type DataType =
  | "null"
  | "undefined"
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "array"
  | "object"
  | "function"
  | string; // Custom types via TYPE_SYMBOL

export interface Size {
  width: number;
  height: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface RenderContext<T = unknown> {
  data: T;
  size: Size;
  path: string;
  depth: number;
  render: (data: unknown, size: Size, path: string) => unknown;
}

export interface ViewerFactory<Output = unknown> {
  (ctx: RenderContext): Output;
}
