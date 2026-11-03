import { defineConfig } from "vitest/config";
import { alias } from "./vite.config.ts";

// The tests run the source of the package, as the page does.
export default defineConfig({
  resolve: { alias },
  test: {
    include: ["src/**/*.test.ts"],
  },
});
