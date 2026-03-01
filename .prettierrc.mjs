/** @type {import("prettier").Config} */
export default {
  plugins: [
    "prettier-plugin-astro",
    "prettier-plugin-organize-imports",
    "prettier-plugin-astro-organize-imports",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        tabWidth: 2,
        parser: "astro",
      },
    },
  ],
  printWidth: 80,
  tabWidth: 2,
  semi: false,
  trailingComma: "es5",
  proseWrap: "always",
  tailwindFunctions: ["tw", "twj", "tv", "cn", "clsx", "twMerge", "cva"],
}
