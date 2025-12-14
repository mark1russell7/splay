import { TYPE_SYMBOL, type DataType } from "./types.js";

export function inferType(value: unknown): DataType {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "function") return "function";
  if (typeof value !== "object") return typeof value as DataType;
  if (TYPE_SYMBOL in value) return (value as { [TYPE_SYMBOL]: string })[TYPE_SYMBOL];
  if (Array.isArray(value)) return "array";
  if (value instanceof Date) return "date";
  return "object";
}
