import eslint from "@eslint/js"
import eslintTanstackQuery from "@tanstack/eslint-plugin-query"
import eslintTanstackRouter from "@tanstack/eslint-plugin-router"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import eslintPluginAstro from "eslint-plugin-astro"
import drizzlePlugin from "eslint-plugin-drizzle"
import eslintPluginReact from "eslint-plugin-react"
import eslintPluginReactCompiler from "eslint-plugin-react-compiler"
import eslintPluginReactHooks from "eslint-plugin-react-hooks"
import eslintPluginReactRefresh from "eslint-plugin-react-refresh"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginAstro.configs.recommended,
  {
    plugins: { drizzle: drizzlePlugin },
    rules: {
      ...drizzlePlugin.configs.recommended.rules,
      "drizzle/enforce-delete-with-where": [
        "error",
        { drizzleObjectName: ["db"] },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules,
      ...eslintPluginReactCompiler.configs.recommended.rules,
      ...eslintTanstackQuery.configs.recommended.rules,
      ...eslintTanstackRouter.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
    plugins: {
      "react-hooks": eslintPluginReactHooks,
      "react-refresh": eslintPluginReactRefresh,
      "react-compiler": eslintPluginReactCompiler,
      "@tanstack/query": eslintTanstackQuery,
      "@tanstack/router": eslintTanstackRouter,
    },
    extends: [
      eslintPluginReact.configs.flat.recommended,
      eslintPluginReact.configs.flat["jsx-runtime"],
    ],
  },
  {
    files: ["/*.{js,jsx,cjs,mjs,ts,tsx,astro}"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "import/order": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeAlias",
          format: ["PascalCase"],
        },
      ],
    },
  },
  {
    files: ["**/{routes,ui}/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off",
    },
  },
  {
    ignores: [
      "**/public",
      "**/dist",
      "**/dist/*",
      "**/.tanstack",
      "**/.astro",
      "**/*.gen.ts",
      "**/tests/*",
      "coverage",
      "node_modules/*",
      "**/__generated__/*",
      ".gitignore",
    ],
  }
)
