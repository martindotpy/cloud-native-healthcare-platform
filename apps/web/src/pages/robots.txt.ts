import { site } from "@healthcare/web/core/configuration/app-configuration"
import type { APIRoute } from "astro"

const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${new URL("sitemap-index.xml", site).href}`.trim()

export const GET: APIRoute = () => {
  return new Response(robotsTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
