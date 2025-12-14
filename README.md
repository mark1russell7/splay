# splay

Minimal recursive data renderer - framework agnostic core.

**181 lines** of TypeScript that provide the complete recursive dispatch algorithm for type-driven rendering.

## Installation

```bash
npm install github:mark1russell7/splay#main
```

## Core Concepts

### 1. Type Inference

Every value has a type. Splay infers it automatically or you can tag values with custom types.

```typescript
import { inferType, TYPE_SYMBOL } from "@mark1russell7/splay";

inferType(null);           // "null"
inferType("hello");        // "string"
inferType([1, 2, 3]);      // "array"
inferType({ a: 1 });       // "object"
inferType(new Date());     // "date"
inferType(() => {});       // "function"

// Custom types via TYPE_SYMBOL
const user = {
  [TYPE_SYMBOL]: "user",
  name: "Alice",
  email: "alice@example.com"
};
inferType(user);           // "user"
```

### 2. Registry

Register viewer factories for each type. Factories receive a `RenderContext` and return your framework's output type.

```typescript
import { createRegistry, type RenderContext } from "@mark1russell7/splay";

// Create a registry (generic over output type)
const registry = createRegistry<string>();

// Register viewers
registry.register("string", (ctx: RenderContext) => `"${ctx.data}"`);
registry.register("number", (ctx: RenderContext) => String(ctx.data));
registry.register("array", (ctx: RenderContext) => {
  const arr = ctx.data as unknown[];
  return `[${arr.map((item, i) =>
    ctx.render(item, ctx.size, `${ctx.path}[${i}]`)
  ).join(", ")}]`;
});
```

### 3. Dispatch

The recursive dispatch algorithm: infer type → lookup factory → execute → recurse.

```typescript
import { dispatch } from "@mark1russell7/splay";

const result = dispatch(myData, { width: 400, height: 300 }, "$", {
  registry,
  fallback: (type, data) => `<unknown: ${type}>`,
});
```

### 4. Async Resolution

Handle dynamic/async values with `resolve()`.

```typescript
import { resolve, isDynamic, type DynamicValue } from "@mark1russell7/splay";

// DynamicValue can be static or a function returning a promise
const staticValue: DynamicValue<User> = { name: "Alice" };
const asyncValue: DynamicValue<User> = async (ctx) => {
  return await ctx.api.getUser("123");
};

// Check if value needs resolution
if (isDynamic(value)) {
  const resolved = await resolve(value, { api: myApi });
}
```

### 5. Layout Math

Pure functions for computing item positions in containers.

```typescript
import { gridLayout, listLayout, splitLayout } from "@mark1russell7/splay";

// Grid: items in columns
const items = gridLayout(
  { width: 400, height: 300 },  // container
  10,                           // item count
  2,                            // columns
  40                            // row height
);
// Returns: [{ pos: {x, y}, size: {width, height}, index }, ...]

// List: vertical stack
const rows = listLayout({ width: 400, height: 300 }, 5, 30);

// Split: two panels
const { left, right } = splitLayout({ width: 400, height: 300 }, 0.3);
```

### 6. Path Helpers

Build paths for nested data.

```typescript
import { arrayPath, objectPath, pathDepth } from "@mark1russell7/splay";

arrayPath("$.users", 0);        // "$.users[0]"
objectPath("$.users[0]", "name"); // "$.users[0].name"
pathDepth("$.users[0].name");   // 4
```

## API Reference

### Types

```typescript
// Type for marking custom types on objects
const TYPE_SYMBOL: unique symbol;

// Built-in types + custom string types
type DataType = "null" | "undefined" | "string" | "number" | "boolean"
              | "date" | "array" | "object" | "function" | string;

// Dimensions
interface Size { width: number; height: number; }
interface Position { x: number; y: number; }

// Context passed to viewer factories
interface RenderContext<T = unknown> {
  data: T;                                              // The value to render
  size: Size;                                           // Available space
  path: string;                                         // Path like "$.users[0].name"
  depth: number;                                        // Nesting level
  render: (data: unknown, size: Size, path: string) => unknown;  // Recursive render
}

// Factory function type
interface ViewerFactory<Output = unknown> {
  (ctx: RenderContext): Output;
}

// Registry interface
interface Registry<Output> {
  register(type: DataType, factory: ViewerFactory<Output>): void;
  get(type: DataType): ViewerFactory<Output> | undefined;
  has(type: DataType): boolean;
}

// Dispatch configuration
interface DispatchConfig<Output> {
  registry: Registry<Output>;
  fallback?: (type: DataType, data: unknown) => Output;
}

// Context for async resolution
interface ResolveContext {
  [key: string]: unknown;  // api, theme, etc.
}

// Static or async value
type DynamicValue<T = unknown> = T | ((ctx: ResolveContext) => T | Promise<T>);

// Layout item
interface LayoutItem {
  pos: Position;
  size: Size;
  index: number;
}
```

### Functions

| Function | Description |
|----------|-------------|
| `inferType(value)` | Returns the DataType of a value |
| `createRegistry<Output>()` | Creates a new type registry |
| `dispatch(data, size, path, config)` | Recursive dispatch algorithm |
| `resolve(value, context?)` | Resolves async/dynamic values |
| `isDynamic(value)` | Checks if value is a function (needs resolution) |
| `gridLayout(container, count, cols, rowHeight)` | Computes grid positions |
| `listLayout(container, count, itemHeight)` | Computes list positions |
| `splitLayout(container, ratio?)` | Splits container horizontally |
| `arrayPath(parent, index)` | Builds array path: `parent[index]` |
| `objectPath(parent, key)` | Builds object path: `parent.key` |
| `pathDepth(path)` | Returns nesting depth |

## Framework Adapters

Splay core is framework-agnostic. Use adapters for your framework:

- **React**: [@mark1russell7/splay-react](https://github.com/mark1russell7/splay-react)
- Vue, Solid, Svelte: Coming soon

### Building an Adapter

An adapter wraps `dispatch()` in your framework's component system:

```typescript
// Minimal React adapter (23 lines)
import { memo, type ReactNode } from "react";
import { dispatch, type Size, type Registry } from "@mark1russell7/splay";

export type ReactRegistry = Registry<ReactNode>;

export const Viewer = memo(function Viewer({
  data,
  size,
  path = "$",
  registry,
}: {
  data: unknown;
  size: Size;
  path?: string;
  registry: ReactRegistry;
}): ReactNode {
  return dispatch(data, size, path, {
    registry,
    fallback: (type) => <div style={{ color: "red" }}>Unknown: {type}</div>,
  }) ?? null;
});
```

## Design Philosophy

1. **Minimal core** - Only the essential algorithm (~180 lines)
2. **Framework-agnostic** - No React/Vue/etc dependencies in core
3. **Type-driven** - Dispatch based on inferred or tagged types
4. **Recursive** - Viewers call `ctx.render()` for nested data
5. **Composable** - Build complex UIs from simple viewers

## License

MIT
