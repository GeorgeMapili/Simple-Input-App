import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["**/node_modules/**", "**/dist/**", "**/src/test/**"],
    },
    include: ["./src/**/*.{test,spec}.ts"],
  },
  resolve: {
    alias: {
      shared: resolve(__dirname, "../shared/dist"),
    },
  },
});
