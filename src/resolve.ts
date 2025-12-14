export interface ResolveContext {
  [key: string]: unknown;
}

export type DynamicValue<T = unknown> =
  | T
  | ((ctx: ResolveContext) => T | Promise<T>);

export async function resolve<T>(
  value: DynamicValue<T>,
  context?: ResolveContext
): Promise<T> {
  if (typeof value === "function") {
    return Promise.resolve((value as (ctx: ResolveContext) => T | Promise<T>)(context ?? {}));
  }
  return value as T;
}

export function isDynamic(value: unknown): value is (ctx: ResolveContext) => unknown {
  return typeof value === "function";
}
