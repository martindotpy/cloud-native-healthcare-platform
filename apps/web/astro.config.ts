import node from "@astrojs/node"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import astroPwa from "@vite-pwa/astro"
import compress from "astro-compress"
import compressor from "astro-compressor"
import openGraphImage from "astro-opengraph-images"
import { defineConfig, fontProviders } from "astro/config"
import checker from "vite-plugin-checker"
import svgr from "vite-plugin-svgr"
import { appName, appShortName } from "./src/core/constant/seo-constant"
import { satoriFonts } from "./src/core/lib/satori"
import { OpenGraphImage } from "./src/core/opengraph/opengraph-image"

// Context
const site = process.env.COOLIFY_URL || "https://healthcare.martindotpy.dev"
const { DEV: isDev } = import.meta.env

// Config
export default defineConfig({
  site,
  trailingSlash: "never",

  integrations: [
    sitemap({
      changefreq: "monthly",
      priority: 0.8,
      serialize(item) {
        if (item.url === `${site}/`) item.priority = 1

        return item
      },
      filter(page) {
        const pageUrl = new URL(page, site)

        if (pageUrl.pathname.endsWith("/_shell")) return false

        return true
      },
    }),
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    openGraphImage({
      options: { fonts: satoriFonts },
      render: OpenGraphImage,
    }),
    astroPwa({
      base: "/",
      scope: "/",
      includeAssets: ["favicon.svg"],
      registerType: "autoUpdate",
      pwaAssets: {
        config: true,
      },
      manifest: {
        start_url: "/",
        name: appName,
        short_name: appShortName,
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
      },
      workbox: {
        navigateFallback: "_shell",
        globPatterns: [
          "**/*.{html,png,jpg,jpeg,svg,webp,avif,gif,ico,js,css,woff2,woff,ttf,otf}",
        ],
        globIgnores: [
          "**\\/node_modules\\/**\\/*",
          "\\/src\\/**\\/*",
          "**/index.png",
          "index.png",
          "sw.js",
          "workbox-*.js",
        ],
      },
      devOptions: {
        enabled: false,
        navigateFallbackAllowlist: [],
      },
    }),
    compress({
      HTML: {
        "html-minifier-terser": false,
      },
      Exclude: "favicon.svg",
    }),
    compressor({ zstd: false }),
  ],

  vite: {
    plugins: [
      devtools(),
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "src/pages/_app/routes",
        generatedRouteTree: "src/pages/_app/routeTree.gen.ts",
        routeFileIgnorePrefix: "-",
        quoteStyle: "double",
      }),
      svgr(),
      ...(isDev
        ? [
            checker({
              typescript: true,
            }),
          ]
        : []),
      tailwindcss(),
    ],
    envPrefix: "PUBLIC_",
    server: {
      proxy: {
        "/api/auth": "http://localhost:3000",
        "/api/appointment": "http://localhost:8080",
        "/api/ehr": "http://localhost:8081",
        "/api/clinical-episode": "http://localhost:8081",
        "/api/health-record": "http://localhost:8081",
        "/api/patient": "http://localhost:8081",
        "/api/prescription": "http://localhost:8081",
        "/api/insurance": "http://localhost:8082",
      },
    },
  },

  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Geist",
        cssVariable: "--font-geist",
        subsets: ["latin"],
        weights: ["100 900"],
        styles: ["normal"],
      },
    ],
    contentIntellisense: true,
  },

  image: { layout: "constrained" },

  // Not necessary because pre-caching of the workbox was configured
  prefetch: false,

  devToolbar: {
    enabled: false,
  },

  adapter: node({ mode: "standalone" }),
})
