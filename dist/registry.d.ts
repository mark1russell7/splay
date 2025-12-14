import type { DataType, ViewerFactory } from "./types.js";
export interface Registry<Output> {
    register: (type: DataType, factory: ViewerFactory<Output>) => void;
    get: (type: DataType) => ViewerFactory<Output> | undefined;
    has: (type: DataType) => boolean;
}
export declare function createRegistry<Output>(): Registry<Output>;
//# sourceMappingURL=registry.d.ts.map