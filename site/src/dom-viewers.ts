// The first viewer set: HTML elements. Each viewer gives an element that carries its type, its path and its width.
import { arrayPath, createRegistry, listLayout, objectPath, splitLayout, type DataType, type RenderContext, type Registry, type Size } from "@mark1russell7/splay";
import { h } from "@mark1russell7/site-pages/chrome";

/** Below this width, an object puts each key above its value. */
export const STACK_WIDTH = 320;
// The space of the index of an array item, and the indent of a stacked value.
const GUTTER = 28;
const INDENT = 12;

/** This function writes the type, the path, the depth and the width of a value into its element. */
export function mark(el: HTMLElement, type: DataType, path: string, size: Size | undefined, depth?: number): HTMLElement {
  el.classList.add("node");
  el.dataset["type"] = type;
  el.dataset["path"] = path;
  if (depth !== undefined) el.dataset["depth"] = String(depth);
  if (size) el.dataset["width"] = String(Math.round(size.width));
  el.tabIndex = 0;
  return el;
}

const node = <K extends keyof HTMLElementTagNameMap>(tag: K, ctx: RenderContext, type: DataType, ...children: (Node | string)[]): HTMLElementTagNameMap[K] => {
  const el = h(tag, { class: `t-${type}` }, ...children);
  mark(el, type, ctx.path, ctx.size, ctx.depth);
  return el;
};

// A nested value gets the path of its key even when dispatch gives the fallback, because the fallback has no path.
const child = (ctx: RenderContext, value: unknown, size: Size, path: string): Node => {
  const out = ctx.render(value, size, path);
  if (out instanceof HTMLElement) {
    if (out.dataset["path"] === undefined) mark(out, out.dataset["type"] ?? "undefined", path, size);
    return out;
  }
  return h("span", { class: "gap" }, "(no output)");
};

const head = (text: string): HTMLElement => h("span", { class: "head" }, text);
const plural = (n: number, one: string): string => `${n} ${one}${n === 1 ? "" : "s"}`;

function money(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
  } catch {
    // The code of the currency is not valid.
    return `${amount} ${currency}`;
  }
}

/** This function makes the registry of the HTML elements. */
export function domRegistry(): Registry<HTMLElement> {
  const registry = createRegistry<HTMLElement>();
  registry.register("string", (ctx) => node("span", ctx, "string", String(ctx.data)));
  registry.register("number", (ctx) => node("span", ctx, "number", String(ctx.data)));
  registry.register("boolean", (ctx) => node("span", ctx, "boolean", String(ctx.data)));
  registry.register("null", (ctx) => node("span", ctx, "null", "null"));
  registry.register("date", (ctx) => {
    const date = ctx.data as Date;
    const el = node("time", ctx, "date", date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }));
    el.dateTime = date.toISOString().slice(0, 10);
    return el;
  });
  registry.register("array", (ctx) => {
    const items = ctx.data as unknown[];
    // listLayout gives each item the full width, less the gutter of the index.
    const boxes = listLayout({ width: ctx.size.width - GUTTER, height: ctx.size.height }, items.length, 0);
    const list = h(
      "ol",
      { class: "items", start: 0 },
      ...items.map((item, i) => h("li", {}, h("span", { class: "index" }, String(i)), child(ctx, item, boxes[i]?.size ?? ctx.size, arrayPath(ctx.path, i)))),
    );
    return node("div", ctx, "array", head(`array · ${plural(items.length, "item")}`), ...(items.length > 0 ? [list] : []));
  });
  registry.register("object", (ctx) => {
    const entries = Object.entries(ctx.data as Record<string, unknown>);
    // splitLayout gives 30 % of the width to the keys and 70 % to the values. A narrow object puts each key above its value.
    const wide = ctx.size.width >= STACK_WIDTH;
    const { left, right } = splitLayout(ctx.size);
    const size: Size = wide ? right : { width: ctx.size.width - INDENT, height: ctx.size.height };
    const rows = h(
      "dl",
      { class: wide ? "rows" : "rows stack", style: wide ? `--key: ${Math.round(left.width)}px` : null },
      ...entries.map(([key, value]) => h("div", { class: "row" }, h("dt", {}, key), h("dd", {}, child(ctx, value, size, objectPath(ctx.path, key))))),
    );
    return node("div", ctx, "object", head(`object · ${plural(entries.length, "key")}`), ...(entries.length > 0 ? [rows] : []));
  });
  registry.register("money", (ctx) => {
    const { amount, currency } = ctx.data as { amount: number; currency: string };
    return node("span", ctx, "money", money(amount, currency));
  });
  registry.register("color", (ctx) => {
    const hex = String((ctx.data as { hex: unknown }).hex);
    const swatch = h("i", { class: "swatch", "aria-hidden": "true", style: /^#[0-9a-f]{3,8}$/i.test(hex) ? `background: ${hex}` : null });
    return node("span", ctx, "color", swatch, hex);
  });
  return registry;
}

/** This function gives the element of a value with no viewer: the fallback of dispatch for the HTML elements. */
export function domFallback(type: DataType, data: unknown): HTMLElement {
  let preview = "";
  try {
    preview = JSON.stringify(data) ?? String(data);
  } catch {
    preview = String(data);
  }
  if (preview.length > 48) preview = `${preview.slice(0, 47)}…`;
  const el = h("div", { class: "fallback" }, h("span", { class: "head" }, `no viewer for “${type}”`), h("code", {}, preview));
  el.dataset["type"] = type;
  el.dataset["fallback"] = "true";
  return el;
}
