import { inferType } from "./infer.js";
import { pathDepth } from "./path.js";
export function dispatch(data, size, path, config) {
    const type = inferType(data);
    const factory = config.registry.get(type);
    if (!factory) {
        return config.fallback?.(type, data);
    }
    const ctx = {
        data,
        size,
        path,
        depth: pathDepth(path),
        render: (childData, childSize, childPath) => dispatch(childData, childSize, childPath, config),
    };
    return factory(ctx);
}
//# sourceMappingURL=dispatch.js.map