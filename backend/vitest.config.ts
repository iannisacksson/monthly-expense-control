import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.ts"],
    sequence: {
      concurrent: false,
    },
    fileParallelism: false,
    setupFiles: ["./tests/setup/env.ts", "./tests/setup/database.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
  },
})