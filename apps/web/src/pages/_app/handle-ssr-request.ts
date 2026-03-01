import { createAppRouter } from "@healthcare/web/pages/_app/router"
import { createRequestHandler } from "@tanstack/react-router/ssr/server"
import type { AstroGlobal } from "astro"

export async function handleSsrRequest(astro: AstroGlobal) {
  const router = createAppRouter(astro)

  const getServerRouter = () => router

  const handler = createRequestHandler({
    request: new Request(astro.request.url.replace(".html", ""), astro.request),
    createRouter: getServerRouter,
  })

  // request handler, which loads the router for SSR
  // when TanStack Router's redirect is thrown, return redirect response
  // ref: https://github.com/TanStack/router/blob/main/packages/react-router/src/ssr/defaultRenderHandler.tsx
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const redirectResponse = await handler(({ router }) => {
    return router.state.redirect
  })

  if (redirectResponse)
    return { redirectResponse, getServerRouter, scriptHtml: "" }

  // Script
  const bufferedScripts = router.serverSsr!.takeBufferedScripts()

  let scriptHtml = ""

  if (bufferedScripts?.tag === "script") {
    const scriptAttr = bufferedScripts.attrs
      ? " " +
        Object.entries(bufferedScripts.attrs)
          .map(([key, value]) => (value ? `${key}="${value}"` : key))
          .join(" ")
      : ""

    scriptHtml = `<script${scriptAttr}>${bufferedScripts.children}</script>`
  }

  return { redirectResponse: null, getServerRouter, scriptHtml }
}
