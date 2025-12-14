export interface ResolveContext {
    [key: string]: unknown;
}
export type DynamicValue<T = unknown> = T | ((ctx: ResolveContext) => T | Promise<T>);
export declare function resolve<T>(value: DynamicValue<T>, context?: ResolveContext): Promise<T>;
export declare function isDynamic(value: unknown): value is (ctx: ResolveContext) => unknown;
//# sourceMappingURL=resolve.d.ts.map