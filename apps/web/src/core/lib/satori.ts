import { Resvg } from "@resvg/resvg-js"
import type { PartialIntegrationOptions } from "astro-opengraph-images"
import fs from "fs/promises"
import satori, { type SatoriOptions } from "satori"

// Constants
const width = 1200
const height = 630

export const satoriFonts: PartialIntegrationOptions["fonts"] = [
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-thin.ttf"),
    weight: 100,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-extra-light.ttf"),
    weight: 200,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-light.ttf"),
    weight: 300,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-regular.ttf"),
    weight: 400,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-medium.ttf"),
    weight: 500,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-semi-bold.ttf"),
    weight: 600,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-bold.ttf"),
    weight: 700,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-extra-bold.ttf"),
    weight: 800,
  },
  {
    name: "Geist",
    data: await fs.readFile("./src/assets/fonts/geist-black.ttf"),
    weight: 900,
  },
]

/**
 * Generates an SVG image from a React component.
 *
 * @param component - A JSX element to render as an SVG image.
 * @returns A Promise that resolves to the SVG image as a string.
 */
export async function SVG(
  component: React.ReactElement,
  options?: SatoriOptions
) {
  return await satori(component, {
    width,
    height,
    fonts: satoriFonts,
    ...options,
  })
}

/**
 * Generates a PNG image from a React component.
 *
 * @param component - A JSX element to render as a PNG image.
 * @returns A Promise that resolves to the PNG image as a Buffer.
 */
export async function PNG(component: React.ReactElement) {
  const svg = await SVG(component)

  const resvg = new Resvg(svg, {
    font: {
      loadSystemFonts: false,
    },
    fitTo: {
      mode: "width",
      value: width,
    },
  })

  return resvg.render().asPng()
}
