import type { Size, Position } from "./types.js";
export interface LayoutItem {
    pos: Position;
    size: Size;
    index: number;
}
export declare function gridLayout(container: Size, count: number, cols: number, rowHeight: number): LayoutItem[];
export declare function listLayout(container: Size, count: number, itemHeight: number): LayoutItem[];
export declare function splitLayout(container: Size, ratio?: number): {
    left: Size;
    right: Size;
};
//# sourceMappingURL=layout.d.ts.map