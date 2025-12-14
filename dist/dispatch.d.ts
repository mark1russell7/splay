import type { DataType, Size } from "./types.js";
import type { Registry } from "./registry.js";
export interface DispatchConfig<Output> {
    registry: Registry<Output>;
    fallback?: (type: DataType, data: unknown) => Output;
}
export declare function dispatch<Output>(data: unknown, size: Size, path: string, config: DispatchConfig<Output>): Output | undefined;
//# sourceMappingURL=dispatch.d.ts.map