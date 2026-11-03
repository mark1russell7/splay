import { dispatch } from "@mark1russell7/splay";
import { describe, expect, it } from "vitest";
import { componentRegistry } from "./component-viewers.ts";
import { PRESETS, read } from "./data.ts";
import { textRegistry } from "./text-viewers.ts";
import { calls, tally, view } from "./view.ts";

const size = { width: 600, height: 400 };
const value = (id: string): unknown => {
  const result = read(PRESETS.find((p) => p.id === id)!.json);
  if (!result.ok) throw new Error(result.error);
  return result.value;
};

describe("the plain string viewers", () => {
  it("render a nested record as indented lines", () => {
    expect(dispatch({ name: "Ada", tags: ["math", "engines"], deep: { a: [1, { b: 2 }] } }, size, "$", { registry: textRegistry() })).toBe(
      ['name: "Ada"', "tags:", '  - "math"', '  - "engines"', "deep:", "  a:", "    - 1", "    - b: 2"].join("\n"),
    );
  });

  it("render the custom types of the custom preset", () => {
    const text = dispatch(value("custom"), size, "$", { registry: textRegistry() }) ?? "";
    expect(text).toContain("total: 129.50 EUR");
    expect(text).toContain("brand: #2f6fde");
    expect(text).toContain("placed: 2026-11-03");
  });

  it("give the fallback for a viewer that is off, and do not visit its children", () => {
    const t = tally();
    const text = dispatch({ a: [1, "two"] }, size, "$", { registry: view(textRegistry(), new Set(["array"]), t), fallback: (type) => `<no viewer for "${type}">` });
    expect(text).toBe('a:\n  <no viewer for "array">');
    expect(calls(t)).toBe(2);
    expect(t.missed.get("array")).toBe(1);
  });
});

describe("the tally of a view", () => {
  it("counts each dispatch call by type", () => {
    const t = tally();
    dispatch({ a: [1, "two", true, null] }, size, "$", { registry: view(textRegistry(), new Set(), t) });
    expect(calls(t)).toBe(6);
    expect(Object.fromEntries(t.viewed)).toEqual({ object: 1, array: 1, number: 1, string: 1, boolean: 1, null: 1 });
  });
});

describe("the component viewers", () => {
  it("give serializable data with the path of each value", () => {
    const out = dispatch({ tags: ["a"] }, size, "$", { registry: componentRegistry() });
    expect(JSON.parse(JSON.stringify(out))).toEqual({
      type: "Record",
      props: { path: "$" },
      children: [{ type: "Field", key: "tags", props: { name: "tags" }, children: [{ type: "List", props: { length: 1, path: "$.tags" }, children: [{ type: "Text", props: { value: "a", path: "$.tags[0]" }, key: 0 }] }] }],
    });
  });
});
