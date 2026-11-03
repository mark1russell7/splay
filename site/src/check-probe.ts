/**
 * The probe of the playground, the layout panel and the API list. The site check of the Pages workflow starts it in a
 * browser at each width, before the deploy. A failed check stops the deploy.
 *
 * The site check reads this TypeScript file directly. It removes the types and the `export` line, and it starts the
 * result as the body of an async function.
 */

// The site check gives these helpers to the probe. Each element of this page is an HTML element.
declare const check: (name: string, ok: unknown, detail?: unknown) => boolean;
declare const until: <T>(fn: () => T | Promise<T>, ms?: number) => Promise<T>;
declare const $: (selector: string) => HTMLElement | null;
declare const $$: (selector: string) => HTMLElement[];
declare const type: (target: string | Element, text: string) => void;
declare const click: (target: string | Element) => void;

const node = (path: string): HTMLElement | undefined => $$("#output .node").find((n) => n.dataset["path"] === path);
const typeAt = (path: string): string | undefined => node(path)?.dataset["type"];
const plain = (): string => $("#plain")?.textContent ?? "";
const stat = (key: string): string | undefined => $("#stats")?.dataset[key];

// The playground: a preset, then JSON that the probe types.
check("the page shows four presets", $$("#presets button").length === 4, $$("#presets button").length);
check("the user record renders an object at $", await until(() => typeAt("$") === "object"), typeAt("$"));
check("$.joined is a date, from {\"$date\": ...}", typeAt("$.joined") === "date" && (node("$.joined")?.textContent ?? "").includes("1843"), node("$.joined")?.textContent);
check("$.tags[1] is a string in an array", typeAt("$.tags") === "array" && typeAt("$.tags[1]") === "string", `${typeAt("$.tags")} ${typeAt("$.tags[1]")}`);

type("#json", '{"a": [1, "two", true, null], "b.c": {"$date": "2026-11-03"}}');
check("typed JSON renders each value with its type", await until(() => typeAt("$.a[3]") === "null"), ["$.a[0]", "$.a[1]", "$.a[2]", "$.a[3]"].map(typeAt).join());
check("dispatch ran 7 times for the typed JSON", stat("calls") === "7", stat("calls"));
check("a key with a dot gets the quoted path $['b.c']", typeAt("$['b.c']") === "date", typeAt("$['b.c']"));
check("the array toggle counts one array", $('#viewers [data-type="array"] .count')?.textContent === "1", $('#viewers [data-type="array"] .count')?.textContent);

click('#viewers [data-type="array"]');
check("with the array viewer off, $.a gets the fallback", await until(() => node("$.a")?.dataset["fallback"] === "true"), node("$.a")?.outerHTML.slice(0, 120));
check("the fallback does not visit the items", node("$.a[0]") === undefined && stat("missed") === "1" && stat("calls") === "3", `${stat("calls")} calls, ${stat("missed")} missed`);
click('#viewers [data-type="array"]');
check("with the array viewer on again, the items come back", await until(() => typeAt("$.a[1]") === "string"), typeAt("$.a[1]"));

const two = node("$.a[1]");
if (two) click(two);
check("a tap on a value shows its type and path", await until(() => $("#inspect-path")?.textContent === "$.a[1]" && $("#inspect-type")?.textContent === "string"), $("#inspect")?.textContent);

// One dispatch, three viewer sets.
click('#renderers [data-renderer="text"]');
check("the plain string viewers render the same data", await until(() => plain().includes('- "two"') && plain().includes("b.c: 2026-11-03")), plain().slice(0, 120));
click('#renderers [data-renderer="component"]');
check("the component viewers give component data", await until(() => plain().includes('"type": "List"') && plain().includes('"path": "$.a[1]"')), plain().slice(0, 120));
click('#renderers [data-renderer="html"]');
check("the HTML viewers come back", await until(() => typeAt("$.a") === "array"), typeAt("$.a"));

click('#presets [data-preset="custom"]');
check("a TYPE_SYMBOL type gets its own viewer", await until(() => typeAt("$.total") === "money" && (node("$.total")?.textContent ?? "").includes("129.50")), node("$.total")?.textContent);
check("the color viewer shows a swatch", typeAt("$.brand") === "color" && node("$.brand")?.querySelector(".swatch") !== null, typeAt("$.brand"));

type("#json", "{");
check("invalid JSON shows an error and dims the output", await until(() => $("#json-status")?.dataset["state"] === "error" && $("#output")?.classList.contains("stale")), $("#json-status")?.textContent);
click('#presets [data-preset="tree"]');
check("a preset clears the error", await until(() => $("#json-status")?.dataset["state"] === "ok" && typeAt("$.children[1].children[0].label") === "string"), $("#json-status")?.textContent);

// The layout panel.
const width = (): number => Number(($("#lay-w") as HTMLInputElement | null)?.value ?? 0);
const boxes = (): HTMLElement[] => $$("#lay-boxes .box");
click('#lay-kind [data-kind="grid"]');
check("gridLayout draws one box for each item", await until(() => boxes().length === Number(($("#lay-n") as HTMLInputElement | null)?.value)), boxes().length);
type("#lay-w", "240");
check(
  "a new width gives boxes of width / columns",
  await until(() => Math.abs(Number(boxes()[0]?.dataset["width"]) - width() / 4) < 0.01),
  `${boxes()[0]?.dataset["width"]} for ${width()}`,
);
check("the code line shows the call", ($("#lay-code")?.textContent ?? "").startsWith(`gridLayout({ width: ${width()},`), $("#lay-code")?.textContent);
click('#lay-kind [data-kind="split"]');
check(
  "splitLayout gives two boxes, 30 % and 70 %",
  await until(() => boxes().length === 2 && Math.abs(Number(boxes()[0]?.dataset["width"]) - width() * 0.3) < 0.01),
  boxes().map((b) => b.dataset["width"]).join(),
);

// The API list and the sample.
const outputs = (): HTMLElement[] => $$("#api-rows output");
check("each API example shows its live result", await until(() => outputs().length >= 12 && outputs().every((o) => o.textContent !== "…" && !(o.textContent ?? "").startsWith("Error"))), outputs().map((o) => o.textContent).join(" | "));
check("resolve gives 42", outputs().some((o) => o.textContent === "42"));
check("the sample shows the real output", ($("#sample")?.textContent ?? "").includes('//   - "engines"'), $("#sample")?.textContent);
check("the package row shows the version", /^\d+\.\d+\.\d+/.test($(".package .version")?.textContent ?? ""), $(".package .version")?.textContent);

export {};
