"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inferType = inferType;
var types_js_1 = require("./types.js");
function inferType(value) {
    if (value === null)
        return "null";
    if (value === undefined)
        return "undefined";
    if (typeof value === "function")
        return "function";
    if (typeof value !== "object")
        return typeof value;
    if (types_js_1.TYPE_SYMBOL in value)
        return value[types_js_1.TYPE_SYMBOL];
    if (Array.isArray(value))
        return "array";
    if (value instanceof Date)
        return "date";
    return "object";
}
