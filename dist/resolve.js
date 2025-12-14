export async function resolve(value, context) {
    if (typeof value === "function") {
        return Promise.resolve(value(context ?? {}));
    }
    return value;
}
export function isDynamic(value) {
    return typeof value === "function";
}
//# sourceMappingURL=resolve.js.map