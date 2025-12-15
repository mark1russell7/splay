"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayPath = arrayPath;
exports.objectPath = objectPath;
exports.pathDepth = pathDepth;
function arrayPath(parent, index) {
    return "".concat(parent, "[").concat(index, "]");
}
function objectPath(parent, key) {
    return "".concat(parent, ".").concat(key);
}
function pathDepth(path) {
    return path.split(".").length;
}
