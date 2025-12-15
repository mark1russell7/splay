"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gridLayout = gridLayout;
exports.listLayout = listLayout;
exports.splitLayout = splitLayout;
function gridLayout(container, count, cols, rowHeight) {
    var itemWidth = container.width / cols;
    return Array.from({ length: count }, function (_, i) { return ({
        index: i,
        pos: { x: (i % cols) * itemWidth, y: Math.floor(i / cols) * rowHeight },
        size: { width: itemWidth, height: rowHeight },
    }); });
}
function listLayout(container, count, itemHeight) {
    return Array.from({ length: count }, function (_, i) { return ({
        index: i,
        pos: { x: 0, y: i * itemHeight },
        size: { width: container.width, height: itemHeight },
    }); });
}
function splitLayout(container, ratio) {
    if (ratio === void 0) { ratio = 0.3; }
    return {
        left: { width: container.width * ratio, height: container.height },
        right: { width: container.width * (1 - ratio), height: container.height },
    };
}
