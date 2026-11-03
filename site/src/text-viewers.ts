import { arrayPath, createRegistry, inferType, objectPath, type Registry } from "@mark1russell7/splay";

// A nested array or object goes on the next lines, with an indent of two spaces.
const nested = (value: unknown): boolean => {
  const type = inferType(value);
  return (type === "array" || type === "object") && Object.keys(value as object).length > 0;
};
const indent = (text: string): string => text.replace(/^/gm, "  ");

export function textRegistry(): Registry<string> {
  const registry = createRegistry<string>();
  registry.register("string", (ctx) => JSON.stringify(ctx.data));
  registry.register("number", (ctx) => String(ctx.data));
  registry.register("boolean", (ctx) => String(ctx.data));
  registry.register("null", () => "null");
  registry.register("date", (ctx) => (ctx.data as Date).toISOString().slice(0, 10));
  registry.register("array", (ctx) => {
    const items = ctx.data as unknown[];
    if (items.length === 0) return "[]";
    return items
      .map((item, i) => `- ${indent(String(ctx.render(item, ctx.size, arrayPath(ctx.path, i)))).trimStart()}`)
      .join("\n");
  });
  registry.register("object", (ctx) => {
    const entries = Object.entries(ctx.data as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    return entries
      .map(([key, value]) => {
        const out = String(ctx.render(value, ctx.size, objectPath(ctx.path, key)));
        return nested(value) ? `${key}:\n${indent(out)}` : `${key}: ${out}`;
      })
      .join("\n");
  });
  // Two custom types: an object with TYPE_SYMBOL "money" or "color" comes here, not to "object".
  registry.register("money", (ctx) => {
    const { amount, currency } = ctx.data as { amount: number; currency: string };
    return `${amount.toFixed(2)} ${currency}`;
  });
  registry.register("color", (ctx) => (ctx.data as { hex: string }).hex);
  return registry;
}
