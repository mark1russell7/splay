import type { DataType, Size, RenderContext } from "./types.js";
import type { Registry } from "./registry.js";
import { inferType } from "./infer.js";
import { pathDepth } from "./path.js";

export interface DispatchConfig<Output> {
  registry: Registry<Output>;
  fallback?: (type: DataType, data: unknown) => Output;
}

export function dispatch<Output>(
  data: unknown,
  size: Size,
  path: string,
  config: DispatchConfig<Output>
): Output | undefined {
  const type = inferType(data);
  const factory = config.registry.get(type);

  if (!factory) {
    return config.fallback?.(type, data);
  }

  const ctx: RenderContext = {
    data,
    size,
    path,
    depth: pathDepth(path),
    render: (childData: unknown, childSize: Size, childPath: string): unknown =>
      dispatch(childData, childSize, childPath, config),
  };

  return factory(ctx);
}
