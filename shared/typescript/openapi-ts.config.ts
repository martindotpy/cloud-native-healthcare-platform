import { defineConfig } from "@hey-api/openapi-ts"

export default defineConfig({
  input: [
    "http://localhost:4321/api/appointment/openapi.json",
    "http://localhost:4321/api/ehr/openapi.json",
    "http://localhost:4321/api/insurance/openapi.json",
  ],
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
