import { describe, it, expect, vi } from "vitest";
import { createRegistry } from "../index.js";

describe("createRegistry", () => {
  it("creates an empty registry", () => {
    const registry = createRegistry<string>();
    expect(registry.has("string")).toBe(false);
    expect(registry.get("string")).toBeUndefined();
  });

  it("registers and retrieves factories", () => {
    const registry = createRegistry<string>();
    const factory = vi.fn(() => "result");

    registry.register("string", factory);

    expect(registry.has("string")).toBe(true);
    expect(registry.get("string")).toBe(factory);
  });

  it("overwrites existing factories", () => {
    const registry = createRegistry<string>();
    const factory1 = vi.fn(() => "first");
    const factory2 = vi.fn(() => "second");

    registry.register("string", factory1);
    registry.register("string", factory2);

    expect(registry.get("string")).toBe(factory2);
  });

  it("supports custom type names", () => {
    const registry = createRegistry<string>();
    const factory = vi.fn(() => "custom");

    registry.register("my-custom-type", factory);

    expect(registry.has("my-custom-type")).toBe(true);
    expect(registry.get("my-custom-type")).toBe(factory);
  });

  it("supports multiple types independently", () => {
    const registry = createRegistry<string>();
    const stringFactory = vi.fn(() => "string-result");
    const numberFactory = vi.fn(() => "number-result");
    const arrayFactory = vi.fn(() => "array-result");

    registry.register("string", stringFactory);
    registry.register("number", numberFactory);
    registry.register("array", arrayFactory);

    expect(registry.get("string")).toBe(stringFactory);
    expect(registry.get("number")).toBe(numberFactory);
    expect(registry.get("array")).toBe(arrayFactory);
    expect(registry.has("object")).toBe(false);
  });
});
