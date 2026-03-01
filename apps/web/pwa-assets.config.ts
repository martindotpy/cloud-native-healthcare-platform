import type { Asset } from "@vite-pwa/assets-generator"
import { defineConfig } from "@vite-pwa/assets-generator/config"

const resizeOptions: Asset["resizeOptions"] = {
  background: "#f6fbff",
}

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    transparent: {
      sizes: [64, 150, 192, 512],
      favicons: [
        [16, "favicon-16x16.ico"],
        [32, "favicon.ico"],
        [48, "favicon-48x48.ico"],
        [64, "favicon-64x64.ico"],
      ],
    },
    maskable: {
      sizes: [512],
      resizeOptions,
    },
    apple: {
      sizes: [180, 152, 144, 120, 114, 76, 72, 60, 57],
      resizeOptions,
    },
  },
  images: ["public/favicon.svg"],
})
