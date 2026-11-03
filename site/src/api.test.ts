import { describe, expect, it } from "vitest";
import { API, result } from "./api.ts";

describe("the API list", () => {
  it("runs each example with no error", async () => {
    const all = await Promise.all(API.flatMap((row) => row.examples.map(result)));
    expect(all.filter((text) => text.startsWith("Error"))).toEqual([]);
    expect(all).toContain("42");
    expect(all).toContain('"$[\'a.b\']"');
  });
});
