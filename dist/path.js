export function arrayPath(parent, index) {
    return `${parent}[${index}]`;
}
// A dot divides the segments of a path, and a bracket starts an index.
// A key with one of these characters goes in quoted brackets: $['a.b'].
const NEEDS_QUOTES = /[.[\]]/;
export function objectPath(parent, key) {
    if (!NEEDS_QUOTES.test(key))
        return `${parent}.${key}`;
    return `${parent}['${key.replace(/[\\']/g, "\\$&")}']`;
}
// Each dot and each quoted key (['...']) adds one level. An index ([0]) does not.
export function pathDepth(path) {
    let depth = 1;
    for (let i = 0; i < path.length; i++) {
        if (path[i] === ".") {
            depth++;
        }
        else if (path.startsWith("['", i)) {
            depth++;
            // A dot or a bracket in the quoted key is part of the key. A backslash escapes the next character.
            i += 2;
            while (i < path.length && path[i] !== "'")
                i += path[i] === "\\" ? 2 : 1;
        }
    }
    return depth;
}
//# sourceMappingURL=path.js.map