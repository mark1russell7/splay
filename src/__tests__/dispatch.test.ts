import { describe, it, expect, vi } from "vitest";
import { dispatch, createRegistry, inferType, TYPE_SYMBOL } from "../index.js";
import type { RenderContext } from "../index.js";

describe("dispatch", () => {
  it("dispatches to registered factory based on type", () => {
    const registry = createRegistry<string>();
    const stringFactory = vi.fn((ctx: RenderContext) => `string:${ctx.data}`);

    registry.register("string", stringFactory);

    const result = dispatch("hello", { width: 100, height: 50 }, "root", { registry });

    expect(result).toBe("string:hello");
    expect(stringFactory).toHaveBeenCalledTimes(1);
  });

  it("passes correct context to factory", () => {
    const registry = createRegistry<unknown>();
    const factory = vi.fn((ctx: RenderContext) => ctx);

    registry.register("number", factory);

    dispatch(42, { width: 200, height: 100 }, "data.value", { registry });

    expect(factory).toHaveBeenCalledWith(
      expect.objectContaining({
        data: 42,
        size: { width: 200, height: 100 },
        path: "data.value",
        depth: 2,
      })
    );
  });

  it("returns undefined when no factory registered", () => {
    const registry = createRegistry<string>();

    const result = dispatch("hello", { width: 100, height: 50 }, "root", { registry });

    expect(result).toBeUndefined();
  });

  it("calls fallback when no factory registered", () => {
    const registry = createRegistry<string>();
    const fallback = vi.fn((type, data) => `fallback:${type}:${data}`);

    const result = dispatch("hello", { width: 100, height: 50 }, "root", {
      registry,
      fallback,
    });

    expect(result).toBe("fallback:string:hello");
    expect(fallback).toHaveBeenCalledWith("string", "hello");
  });

  it("handles custom types via TYPE_SYMBOL", () => {
    const registry = createRegistry<string>();
    const customFactory = vi.fn(() => "custom-result");

    registry.register("my-type", customFactory);

    const customValue = { [TYPE_SYMBOL]: "my-type", value: 123 };
    const result = dispatch(customValue, { width: 100, height: 50 }, "root", { registry });

    expect(result).toBe("custom-result");
    expect(customFactory).toHaveBeenCalledTimes(1);
  });

  it("provides render function in context for recursive dispatch", () => {
    const registry = createRegistry<string>();
    let capturedRender: ((data: unknown, size: { width: number; height: number }, path: string) => unknown) | null = null;

    const arrayFactory = vi.fn((ctx: RenderContext) => {
      capturedRender = ctx.render;
      return "array-result";
    });
    const stringFactory = vi.fn(() => "string-result");

    registry.register("array", arrayFactory);
    registry.register("string", stringFactory);

    dispatch([1, 2, 3], { width: 100, height: 50 }, "root", { registry });

    expect(capturedRender).toBeDefined();

    // Use the render function to dispatch child
    const childResult = capturedRender!("child", { width: 50, height: 25 }, "root[0]");
    expect(childResult).toBe("string-result");
  });

  it("calculates depth from path", () => {
    const registry = createRegistry<number>();
    const factory = vi.fn((ctx: RenderContext) => ctx.depth);

    registry.register("string", factory);

    expect(dispatch("a", { width: 100, height: 50 }, "root", { registry })).toBe(1);
    expect(dispatch("b", { width: 100, height: 50 }, "root.child", { registry })).toBe(2);
    expect(dispatch("c", { width: 100, height: 50 }, "a.b.c.d", { registry })).toBe(4);
  });
});
