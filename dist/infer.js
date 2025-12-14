import { TYPE_SYMBOL } from "./types.js";
export function inferType(value) {
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    if (typeof value === "function")
        return "function";
    if (typeof value !== "object")
        return typeof value;
    if (TYPE_SYMBOL in value)
        return value[TYPE_SYMBOL];
    if (Array.isArray(value))
        return "array";
    if (value instanceof Date)
        return "date";
    return "object";
}
//# sourceMappingURL=infer.js.map