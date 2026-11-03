// The data of the playground: the presets, and the reader that changes JSON text into the value that dispatch gets.
import { TYPE_SYMBOL } from "@mark1russell7/splay";

/** One preset of the playground. */
export interface Preset {
  readonly id: string;
  readonly label: string;
  readonly json: string;
}

const text = (value: unknown): string => JSON.stringify(value, null, 2);

/** The presets of the playground, in the order of the page. */
export const PRESETS: readonly Preset[] = [
  {
    id: "user",
    label: "User record",
    json: text({
      name: "Ada Lovelace",
      age: 36,
      admin: true,
      manager: null,
      joined: { $date: "1843-07-01" },
      tags: ["math", "engines"],
    }),
  },
  {
    id: "tree",
    label: "Nested tree",
    json: text({
      label: "src",
      children: [
        { label: "index.ts", lines: 8 },
        {
          label: "layout",
          children: [
            { label: "grid.ts", lines: 21 },
            { label: "split.ts", lines: 9 },
          ],
        },
      ],
    }),
  },
  {
    id: "mixed",
    label: "Mixed array",
    json: text([1, "two", true, null, [3, [4, "five"]], { six: 6, "a.b": "a quoted key" }, { $date: "2026-01-01" }, []]),
  },
  {
    id: "custom",
    label: "Custom types",
    json: text({
      order: "A-1042",
      placed: { $date: "2026-11-03" },
      total: { $type: "money", amount: 129.5, currency: "EUR" },
      brand: { $type: "color", hex: "#2f6fde" },
      lines: [
        { item: "Desk lamp", price: { $type: "money", amount: 49.5, currency: "EUR" } },
        { item: "Chair", price: { $type: "money", amount: 80, currency: "EUR" } },
      ],
    }),
  },
];

/** The result of `read`: the value for dispatch, or the error of the JSON text. */
export type ReadResult = { readonly ok: true; readonly value: unknown } | { readonly ok: false; readonly error: string };

/**
 * This function reads JSON text. JSON has no dates and no symbols, so the reader changes two forms:
 * an object `{ "$date": "2026-11-03" }` becomes a `Date`, and the key `"$type"` of an object becomes its `TYPE_SYMBOL`.
 */
export function read(source: string): ReadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
  return { ok: true, value: revive(parsed) };
}

function revive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(revive);
  if (value === null || typeof value !== "object") return value;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  const date = record["$date"];
  if (keys.length === 1 && typeof date === "string") {
    const parsed = new Date(date);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const out: Record<string | symbol, unknown> = {};
  for (const key of keys) {
    if (key === "$type" && typeof record[key] === "string") out[TYPE_SYMBOL] = record[key];
    else out[key] = revive(record[key]);
  }
  return out;
}
