// The third viewer set: serializable component data (ComponentOutput). A React, Vue or Solid app hydrates it into components.
import { arrayPath, createRegistry, objectPath, type ComponentOutput, type Registry } from "@mark1russell7/splay";

/** This function makes the registry of the component data. Each viewer gives a `ComponentOutput` with the path in its props. */
export function componentRegistry(): Registry<ComponentOutput> {
  const registry = createRegistry<ComponentOutput>();
  const leaf = (type: string) => (ctx: { data: unknown; path: string }): ComponentOutput => ({ type, props: { value: ctx.data, path: ctx.path } });
  registry.register("string", leaf("Text"));
  registry.register("number", leaf("Number"));
  registry.register("boolean", leaf("Boolean"));
  registry.register("null", leaf("Null"));
  registry.register("date", (ctx) => ({ type: "Date", props: { iso: (ctx.data as Date).toISOString().slice(0, 10), path: ctx.path } }));
  registry.register("array", (ctx) => {
    const items = ctx.data as unknown[];
    return {
      type: "List",
      props: { length: items.length, path: ctx.path },
      children: items.map((item, i) => ({ ...(ctx.render(item, ctx.size, arrayPath(ctx.path, i)) as ComponentOutput), key: i })),
    };
  });
  registry.register("object", (ctx) => ({
    type: "Record",
    props: { path: ctx.path },
    children: Object.entries(ctx.data as Record<string, unknown>).map(([name, value]) => ({
      type: "Field",
      key: name,
      props: { name },
      children: [ctx.render(value, ctx.size, objectPath(ctx.path, name)) as ComponentOutput],
    })),
  }));
  registry.register("money", (ctx) => {
    const { amount, currency } = ctx.data as { amount: number; currency: string };
    return { type: "Money", props: { amount, currency, path: ctx.path } };
  });
  registry.register("color", (ctx) => ({ type: "Swatch", props: { hex: (ctx.data as { hex: string }).hex, path: ctx.path } }));
  return registry;
}
