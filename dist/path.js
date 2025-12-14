export function arrayPath(parent, index) {
    return `${parent}[${index}]`;
}
export function objectPath(parent, key) {
    return `${parent}.${key}`;
}
export function pathDepth(path) {
    return path.split(".").length;
}
//# sourceMappingURL=path.js.map