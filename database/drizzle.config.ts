import { defineConfig } from "drizzle-kit"

// Configuration
export default defineConfig({
  schema: "./src/**/*-schema.ts",
  dialect: "postgresql",
  out: "migration",
  casing: "snake_case",
})
