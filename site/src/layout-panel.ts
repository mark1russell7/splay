// The layout panel: the visitor picks a helper and drags the size of the container, and the stage draws the boxes.
import { byId, h } from "@mark1russell7/site-pages/chrome";
import { layout, type LayoutKind, type LayoutSettings } from "./layout.ts";

const KINDS: readonly { readonly id: LayoutKind; readonly label: string }[] = [
  { id: "grid", label: "gridLayout" },
  { id: "list", label: "listLayout" },
  { id: "split", label: "splitLayout" },
];

// The controls that each helper uses. The other controls hide.
const USES: Readonly<Record<LayoutKind, readonly string[]>> = {
  grid: ["w", "h", "n", "cols", "row"],
  list: ["w", "h", "n", "row"],
  split: ["w", "h", "ratio"],
};

const MIN_WIDTH = 120;
const MIN_HEIGHT = 80;
const DEFAULT_WIDTH = 480;

export class LayoutPanel {
  private kind: LayoutKind = "grid";
  private readonly wrap = byId("lay-wrap");
  private readonly stage = byId("lay-stage");
  private readonly boxes = byId("lay-boxes");
  private readonly inputs = new Map<string, HTMLInputElement>();
  // This value is true after the visitor changes the width or the height.
  private touched = false;

  constructor() {
    for (const id of ["w", "h", "n", "cols", "row", "ratio"]) {
      const input = byId<HTMLInputElement>(`lay-${id}`);
      this.inputs.set(id, input);
      input.addEventListener("input", () => {
        if (id === "w" || id === "h") this.touched = true;
        this.render();
      });
    }
    byId("lay-kind").replaceChildren(
      ...KINDS.map((k) => {
        const button = h("button", { type: "button", role: "radio", "data-kind": k.id, "aria-checked": String(k.id === this.kind) }, k.label);
        button.addEventListener("click", () => {
          this.kind = k.id;
          for (const b of document.querySelectorAll<HTMLButtonElement>("#lay-kind button")) b.setAttribute("aria-checked", String(b.dataset["kind"] === k.id));
          this.render();
        });
        return button;
      }),
    );
    this.setupGrip();
    new ResizeObserver(() => this.fit()).observe(this.wrap);
    this.fit();
  }

  private input(id: string): HTMLInputElement {
    return this.inputs.get(id)!;
  }

  /**
   * This method keeps the width of the container in the width of the panel. Until the visitor sets a width, the width
   * is the default width, or the width of the panel when it is smaller.
   */
  private fit(): void {
    const max = Math.max(MIN_WIDTH, Math.floor(this.wrap.clientWidth));
    const w = this.input("w");
    if (Number(w.max) !== max) {
      w.max = String(max);
      w.value = String(this.touched ? Math.min(Number(w.value), max) : Math.min(DEFAULT_WIDTH, max));
    }
    this.render();
  }

  private setupGrip(): void {
    const grip = byId("lay-grip");
    let start: { x: number; y: number; w: number; h: number } | null = null;
    grip.addEventListener("pointerdown", (event) => {
      grip.setPointerCapture(event.pointerId);
      this.touched = true;
      start = { x: event.clientX, y: event.clientY, w: Number(this.input("w").value), h: Number(this.input("h").value) };
      event.preventDefault();
    });
    grip.addEventListener("pointermove", (event) => {
      if (!start) return;
      const w = this.input("w");
      const hi = this.input("h");
      w.value = String(Math.round(Math.min(Number(w.max), Math.max(MIN_WIDTH, start.w + event.clientX - start.x))));
      hi.value = String(Math.round(Math.min(Number(hi.max), Math.max(MIN_HEIGHT, start.h + event.clientY - start.y))));
      this.render();
    });
    const end = (): void => {
      start = null;
    };
    grip.addEventListener("pointerup", end);
    grip.addEventListener("pointercancel", end);
    // The keyboard changes the size with the arrow keys.
    grip.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 40 : 10;
      const moves: Record<string, [string, number]> = { ArrowRight: ["w", step], ArrowLeft: ["w", -step], ArrowDown: ["h", step], ArrowUp: ["h", -step] };
      const move = moves[event.key];
      if (!move) return;
      this.touched = true;
      const input = this.input(move[0]);
      input.value = String(Number(input.value) + move[1]);
      event.preventDefault();
      this.render();
    });
  }

  private settings(): LayoutSettings {
    const n = (id: string): number => Number(this.input(id).value);
    return { kind: this.kind, width: n("w"), height: n("h"), count: n("n"), cols: n("cols"), row: n("row"), ratio: n("ratio") };
  }

  private render(): void {
    const s = this.settings();
    for (const [id, input] of this.inputs) {
      const field = input.closest<HTMLElement>(".range")!;
      field.hidden = !USES[this.kind].includes(id);
      field.querySelector("output")!.textContent = id === "ratio" ? s.ratio.toFixed(2) : input.value;
    }
    byId("lay-row-label").textContent = this.kind === "grid" ? "Row height" : "Item height";
    const result = layout(s);
    byId("lay-code").textContent = result.code;
    byId("lay-note").textContent = result.note;
    this.stage.style.width = `${s.width}px`;
    this.stage.style.height = `${s.height}px`;
    const bottom = Math.max(s.height, ...result.boxes.map((b) => b.pos.y + b.size.height));
    this.boxes.style.height = `${bottom}px`;
    this.wrap.style.minHeight = `${bottom + 12}px`;
    this.boxes.replaceChildren(
      ...result.boxes.map((b) => {
        const box = h(
          "div",
          {
            class: b.out ? "box out" : "box",
            "data-index": b.index,
            style: `left: ${b.pos.x}px; top: ${b.pos.y}px; width: ${b.size.width}px; height: ${b.size.height}px`,
            title: `${b.label}: x ${Math.round(b.pos.x)}, y ${Math.round(b.pos.y)}, ${Math.round(b.size.width)} × ${Math.round(b.size.height)}`,
          },
          b.size.width >= 22 && b.size.height >= 16 ? h("span", {}, b.label) : null,
        );
        box.dataset["width"] = String(b.size.width);
        return box;
      }),
    );
  }
}
