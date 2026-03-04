import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: ["http://localhost:8080/api/appointment/openapi.json"],
  output: {
    path: "src/api/client",
    postProcess: ["prettier"],
  },
  watch: true,

  plugins: [
    {
      name: "@hey-api/client-axios",
      baseUrl: false,
    },
    "@tanstack/react-query",
  ],
})
