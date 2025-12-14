export declare const TYPE_SYMBOL: unique symbol;
export type DataType = "null" | "undefined" | "string" | "number" | "boolean" | "date" | "array" | "object" | "function" | string;
export interface Size {
    width: number;
    height: number;
}
export interface Position {
    x: number;
    y: number;
}
export interface RenderContext<T = unknown> {
    data: T;
    size: Size;
    path: string;
    depth: number;
    render: (data: unknown, size: Size, path: string) => unknown;
}
export interface ViewerFactory<Output = unknown> {
    (ctx: RenderContext): Output;
}
//# sourceMappingURL=types.d.ts.map