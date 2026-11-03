// The start of the page: the theme, the playground, the layout panel, the API list, the code sample and the build line.
import "@mark1russell7/site-pages/scroll-cue.css";
import { dispatch } from "@mark1russell7/splay";
import { API, result } from "./api.ts";
import { byId, copyText, h, setupTheme } from "@mark1russell7/site-pages/chrome";
import { LayoutPanel } from "./layout-panel.ts";
import { Playground } from "./playground.ts";
import "./style.css";
import { textRegistry } from "./text-viewers.ts";
import viewerSource from "./text-viewers.ts?raw";

setupTheme(byId<HTMLButtonElement>("theme"), "splay-theme");
new Playground();
new LayoutPanel();

byId("api-rows").replaceChildren(
  ...API.map((row) => {
    const outputs = row.examples.map((example) => {
      const out = h("output", { class: "mono" }, "…");
      void result(example).then((text) => {
        out.textContent = text;
      });
      return h("div", { class: "ex" }, h("code", { class: "scroll-cue" }, example.code), h("span", { class: "arrow", "aria-hidden": "true" }, "→"), out);
    });
    return h(
      "article",
      { class: "api-row" },
      h("h3", {}, ...row.names.map((name) => h("code", { class: "name" }, name))),
      h("p", {}, row.what),
      h("div", { class: "live" }, ...outputs),
    );
  }),
);

// The sample runs the viewers of the page, so its output comment is the real output. Keep the data and its text the same.
const sampleData = { name: "Ada", tags: ["math", "engines"] };
const sampleOut = dispatch(sampleData, { width: 600, height: 400 }, "$", { registry: textRegistry() }) ?? "";
byId("sample").textContent = [
  'import { dispatch } from "@mark1russell7/splay";',
  'import { textRegistry } from "./text-viewers.ts";',
  "",
  'const data = { name: "Ada", tags: ["math", "engines"] };',
  'const text = dispatch(data, { width: 600, height: 400 }, "$", { registry: textRegistry() });',
  ...sampleOut.split("\n").map((line, i) => `${i === 0 ? "// text:\n// " : "// "}${line}`),
].join("\n");
byId("viewers-source").textContent = viewerSource.trimEnd();

for (const button of document.querySelectorAll<HTMLButtonElement>("button[data-copy]")) {
  button.addEventListener("click", () => void copyText(button, byId(button.dataset["copy"]!).textContent ?? ""));
}

for (const el of document.querySelectorAll(".version")) el.textContent = __BUILD__.version;
byId("build").append(
  `Version ${__BUILD__.version}, build `,
  __BUILD__.sha === "local" ? "local" : h("a", { href: `https://github.com/mark1russell7/splay/commit/${__BUILD__.sha}` }, __BUILD__.sha),
  ` of ${__BUILD__.date}`,
);
