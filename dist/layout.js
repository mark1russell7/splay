export function gridLayout(container, count, cols, rowHeight) {
    const itemWidth = container.width / cols;
    return Array.from({ length: count }, (_, i) => ({
        index: i,
        pos: { x: (i % cols) * itemWidth, y: Math.floor(i / cols) * rowHeight },
        size: { width: itemWidth, height: rowHeight },
    }));
}
export function listLayout(container, count, itemHeight) {
    return Array.from({ length: count }, (_, i) => ({
        index: i,
        pos: { x: 0, y: i * itemHeight },
        size: { width: container.width, height: itemHeight },
    }));
}
export function splitLayout(container, ratio = 0.3) {
    return {
        left: { width: container.width * ratio, height: container.height },
        right: { width: container.width * (1 - ratio), height: container.height },
    };
}
//# sourceMappingURL=layout.js.map