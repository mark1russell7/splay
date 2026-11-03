// The rows of the API list. The page runs each example with the package and shows its result.
import {
  arrayPath,
  createRegistry,
  dispatch,
  gridLayout,
  inferType,
  isDynamic,
  listLayout,
  objectPath,
  pathDepth,
  resolve,
  splitLayout,
  TYPE_SYMBOL,
} from "@mark1russell7/splay";
import { textRegistry } from "./text-viewers.ts";

/** One example of a row: its code, and the function that runs it. */
export interface Example {
  readonly code: string;
  readonly run: () => unknown;
}

/** One row of the API list. */
export interface ApiRow {
  readonly names: readonly string[];
  readonly what: string;
  readonly examples: readonly Example[];
}

const box = { width: 300, height: 100 };

export const API: readonly ApiRow[] = [
  {
    names: ["createRegistry"],
    what: "This function makes an empty registry. A registry keeps one viewer for each type, with register, get and has.",
    examples: [
      {
        code: 'r.register("string", (ctx) => ctx.data); r.has("string")',
        run: () => {
          const r = createRegistry<unknown>();
          r.register("string", (ctx) => ctx.data);
          return r.has("string");
        },
      },
    ],
  },
  {
    names: ["dispatch"],
    what: "This function finds the type of the data, calls the viewer of that type, and gives its output. A viewer calls ctx.render for nested values.",
    examples: [{ code: 'dispatch([1, "a"], size, "$", { registry })', run: () => dispatch([1, "a"], box, "$", { registry: textRegistry() }) }],
  },
  {
    names: ["inferType", "TYPE_SYMBOL"],
    what: "This function gives the type of a value. A value with the key TYPE_SYMBOL has the type that the key holds.",
    examples: [
      { code: "inferType(new Date(0))", run: () => inferType(new Date(0)) },
      { code: 'inferType({ [TYPE_SYMBOL]: "user" })', run: () => inferType({ [TYPE_SYMBOL]: "user" }) },
    ],
  },
  {
    names: ["gridLayout", "listLayout", "splitLayout"],
    what: "These functions calculate the position and the size of each box in a container. They do not clip.",
    examples: [
      { code: "gridLayout(box, 3, 2, 50)[2].pos", run: () => gridLayout(box, 3, 2, 50)[2]?.pos },
      { code: "listLayout(box, 2, 40)[1].pos", run: () => listLayout(box, 2, 40)[1]?.pos },
      { code: "splitLayout(box).left", run: () => splitLayout(box).left },
    ],
  },
  {
    names: ["arrayPath", "objectPath", "pathDepth"],
    what: "These functions make the path of a nested value, and count its depth. A key with a dot goes in quoted brackets.",
    examples: [
      { code: 'arrayPath("$.tags", 1)', run: () => arrayPath("$.tags", 1) },
      { code: 'objectPath("$", "a.b")', run: () => objectPath("$", "a.b") },
      { code: 'pathDepth("$.a.b[0]")', run: () => pathDepth("$.a.b[0]") },
    ],
  },
  {
    names: ["resolve", "isDynamic"],
    what: "This function gives the value of a function or a promise of a value, with a context. Other values stay the same.",
    examples: [
      { code: "await resolve(async (ctx) => ctx.n * 2, { n: 21 })", run: () => resolve(async (ctx) => (ctx["n"] as number) * 2, { n: 21 }) },
      { code: "isDynamic(() => 1)", run: () => isDynamic(() => 1) },
    ],
  },
];

/** This function gives the text of a result: a string as JSON, an object as compact JSON. */
export function show(value: unknown): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

/** This function runs an example, and waits for a promise. */
export async function result(example: Example): Promise<string> {
  try {
    return show(await example.run());
  } catch (error) {
    return `Error: ${error instanceof Error ? error.message : String(error)}`;
  }
}
