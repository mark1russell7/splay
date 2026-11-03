// The playground: the JSON editor, the viewer toggles, the renderer picker and the live output of dispatch.
import { dispatch, type ComponentOutput, type DataType, type Registry, type Size } from "@mark1russell7/splay";
import { byId, h } from "./chrome.ts";
import { componentRegistry } from "./component-viewers.ts";
import { PRESETS, read } from "./data.ts";
import { domFallback, domRegistry, mark } from "./dom-viewers.ts";
import { textRegistry } from "./text-viewers.ts";
import { calls, tally, view, VIEWER_TYPES, type Tally } from "./view.ts";

type Renderer = "html" | "text" | "component";

const RENDERERS: readonly { readonly id: Renderer; readonly label: string; readonly output: string }[] = [
  { id: "html", label: "HTML elements", output: "Registry<HTMLElement>" },
  { id: "text", label: "Plain strings", output: "Registry<string>" },
  { id: "component", label: "Component data", output: "Registry<ComponentOutput>" },
];

const HINTS: Readonly<Record<Renderer, string>> = {
  html: "Hover or tap a value to see its type and its path.",
  text: "The same dispatch, with viewers that give strings. Each line is one value.",
  component: "The same dispatch, with viewers that give JSON data. An app hydrates it into React, Vue or Solid components.",
};

export class Playground {
  private readonly editor = byId<HTMLTextAreaElement>("json");
  private readonly status = byId("json-status");
  private readonly output = byId("output");
  private readonly stats = byId("stats");
  private readonly inspect = byId("inspect");
  private readonly toggles = new Map<DataType, HTMLButtonElement>();
  private readonly sets = { html: domRegistry(), text: textRegistry(), component: componentRegistry() };
  private readonly off = new Set<DataType>();
  private renderer: Renderer = "html";
  private value: unknown = undefined;
  private width = 0;
  private pinned: HTMLElement | null = null;
  private timer = 0;

  constructor() {
    this.setupPresets();
    this.setupRenderers();
    this.setupToggles();
    this.setupInspector();
    byId<HTMLInputElement>("tags").addEventListener("change", (event) => {
      this.output.classList.toggle("tags", (event.target as HTMLInputElement).checked);
    });
    this.editor.addEventListener("input", () => {
      window.clearTimeout(this.timer);
      this.timer = window.setTimeout(() => this.load(), 120);
    });
    new ResizeObserver(() => {
      if (this.renderer === "html" && Math.abs(this.size().width - this.width) >= 1) this.render();
    }).observe(this.output);
    this.choose(PRESETS[0]!.id);
  }

  private setupPresets(): void {
    byId("presets").replaceChildren(
      ...PRESETS.map((preset) => {
        const button = h("button", { type: "button", class: "chip", "data-preset": preset.id, "aria-pressed": "false" }, preset.label);
        button.addEventListener("click", () => this.choose(preset.id));
        return button;
      }),
    );
  }

  private setupRenderers(): void {
    byId("renderers").replaceChildren(
      ...RENDERERS.map((r) => {
        const button = h("button", { type: "button", role: "radio", "data-renderer": r.id, "aria-checked": String(r.id === this.renderer) }, h("span", {}, r.label), h("code", {}, r.output));
        button.addEventListener("click", () => {
          this.renderer = r.id;
          for (const b of document.querySelectorAll<HTMLButtonElement>("#renderers button")) b.setAttribute("aria-checked", String(b.dataset["renderer"] === r.id));
          this.unpin();
          this.render();
        });
        return button;
      }),
    );
  }

  private setupToggles(): void {
    byId("viewers").replaceChildren(
      ...VIEWER_TYPES.map((type) => {
        const button = h("button", { type: "button", class: `toggle t-${type}`, "data-type": type, "aria-pressed": "true", title: `The viewer of "${type}"` }, h("i", { "aria-hidden": "true" }), type, h("span", { class: "count" }, "0"));
        button.addEventListener("click", () => {
          if (this.off.has(type)) this.off.delete(type);
          else this.off.add(type);
          button.setAttribute("aria-pressed", String(!this.off.has(type)));
          this.render();
        });
        this.toggles.set(type, button);
        return button;
      }),
    );
  }

  private setupInspector(): void {
    const nodeOf = (target: EventTarget | null): HTMLElement | null => (target instanceof Element ? target.closest<HTMLElement>("#output .node") : null);
    this.output.addEventListener("pointerover", (event) => {
      const el = nodeOf(event.target);
      if (el) this.show(el);
    });
    this.output.addEventListener("pointerleave", () => this.show(this.pinned));
    this.output.addEventListener("focusin", (event) => this.show(nodeOf(event.target)));
    // A tap or a click pins the value, so the inspector keeps it on a phone.
    this.output.addEventListener("click", (event) => {
      const el = nodeOf(event.target);
      this.pinned?.classList.remove("pinned");
      this.pinned = el;
      el?.classList.add("pinned");
      this.show(el);
    });
  }

  private unpin(): void {
    this.pinned?.classList.remove("pinned");
    this.pinned = null;
    this.show(null);
  }

  private show(el: HTMLElement | null): void {
    for (const hot of this.output.querySelectorAll(".hot")) hot.classList.remove("hot");
    if (!el || !el.isConnected) {
      this.inspect.dataset["state"] = "idle";
      this.inspect.replaceChildren(h("span", { class: "idle" }, HINTS[this.renderer]));
      return;
    }
    el.classList.add("hot");
    const type = el.dataset["type"] ?? "";
    const fallback = el.dataset["fallback"] === "true";
    this.inspect.dataset["state"] = "node";
    this.inspect.replaceChildren(
      h("span", { class: `tag t-${type}`, id: "inspect-type" }, type),
      h("code", { class: "path", id: "inspect-path" }, el.dataset["path"] ?? ""),
      h(
        "span",
        { class: "more" },
        fallback ? "no viewer: the fallback" : `depth ${el.dataset["depth"] ?? "?"}`,
        el.dataset["width"] ? ` · width ${el.dataset["width"]} px` : "",
      ),
    );
  }

  private choose(id: string): void {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    this.editor.value = preset.json;
    this.load();
  }

  /** This method reads the editor. Valid JSON goes to dispatch. Invalid JSON keeps the last output, dimmed. */
  private load(): void {
    const source = this.editor.value;
    for (const b of document.querySelectorAll<HTMLButtonElement>("#presets button")) {
      b.setAttribute("aria-pressed", String(PRESETS.find((p) => p.id === b.dataset["preset"])?.json === source));
    }
    const result = read(source);
    if (!result.ok) {
      this.status.dataset["state"] = "error";
      this.status.textContent = `The JSON has an error: ${result.error}`;
      this.editor.setAttribute("aria-invalid", "true");
      this.output.classList.add("stale");
      return;
    }
    this.status.dataset["state"] = "ok";
    this.status.textContent = "Valid JSON. The output changes as you type.";
    this.editor.removeAttribute("aria-invalid");
    this.output.classList.remove("stale");
    this.value = result.value;
    this.unpin();
    this.render();
  }

  private size(): Size {
    const style = getComputedStyle(this.output);
    const pad = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    return { width: Math.max(0, this.output.clientWidth - pad), height: this.output.clientHeight };
  }

  private run<Output>(registry: Registry<Output>, fallback: (type: DataType, data: unknown) => Output, t: Tally, size: Size): Output | undefined {
    return dispatch(this.value, size, "$", { registry: view(registry, this.off, t), fallback });
  }

  private render(): void {
    const t = tally();
    const size = this.size();
    this.width = size.width;
    this.output.dataset["renderer"] = this.renderer;
    if (this.renderer === "html") {
      const root = this.run(this.sets.html, domFallback, t, size);
      if (root && root.dataset["path"] === undefined) mark(root, root.dataset["type"] ?? "", "$", size);
      this.output.replaceChildren(root ?? h("span", { class: "gap" }, "(no output)"));
    } else if (this.renderer === "text") {
      const text = this.run<string>(this.sets.text, (type) => `<no viewer for "${type}">`, t, size);
      this.output.replaceChildren(h("pre", { class: "plain scroll-cue", id: "plain" }, text ?? ""));
    } else {
      const data = this.run<ComponentOutput>(this.sets.component, (type) => ({ type: "Missing", props: { dataType: type } }), t, size);
      this.output.replaceChildren(h("pre", { class: "plain scroll-cue", id: "plain" }, JSON.stringify(data, null, 2)));
    }
    for (const [type, button] of this.toggles) {
      const count = (t.viewed.get(type) ?? 0) + (t.missed.get(type) ?? 0);
      button.querySelector(".count")!.textContent = String(count);
      button.classList.toggle("zero", count === 0);
    }
    const missed = [...t.missed.values()].reduce((a, b) => a + b, 0);
    const all = calls(t);
    this.stats.dataset["calls"] = String(all);
    this.stats.dataset["missed"] = String(missed);
    this.stats.replaceChildren(
      h("strong", {}, `${all}`),
      ` dispatch ${all === 1 ? "call" : "calls"}: ${all - missed} found a viewer`,
      missed > 0 ? h("span", { class: "miss" }, `, ${missed} got the fallback`) : "",
      ".",
    );
    this.show(null);
  }
}
