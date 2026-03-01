import { BaseError } from "@healthcare/shared/lib/error"

export class SiteNotSetError extends BaseError {
  constructor() {
    super(
      "`site` must be set in your Astro configuration: https://docs.astro.build/en/reference/configuration-reference/#site"
    )
  }
}

interface OpenGraphImageParams {
  url: URL
  site: URL | undefined
}

export function getOpengraphImagePath({ url, site }: OpenGraphImageParams) {
  if (!site) throw new SiteNotSetError()

  let target =
    url.pathname + (url.pathname.endsWith("/") ? "" : "/") + "index.png"

  // Astro creates these as top-level files rather than in a folder
  if (target === "/404/index.png") {
    return site.toString() + "404.png"
  } else if (target === "/500/index.png") {
    return site.toString() + "500.png"
  }

  // Remove starting slash
  target = target.slice(1)

  return site.toString() + target
}
