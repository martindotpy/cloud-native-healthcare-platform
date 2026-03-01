import { DefaultPendingPage } from "@healthcare/web/core/components/template/default-pending-page"
import { TooltipProvider } from "@healthcare/web/core/components/ui/tooltip"
import { isDev } from "@healthcare/web/core/configuration/app-configuration"
import {
  getTanstackQueryContext,
  TanstackQueryProvider,
} from "@healthcare/web/core/integrations/tanstack-query-integration"
import { ErrorMainSection } from "@healthcare/web/error/components/sections/error-main-section"
import { NotFoundMainSection } from "@healthcare/web/not-found/components/organisms/sections/not-found-main-section"
import { routeTree } from "@healthcare/web/pages/_app/routeTree.gen"
import { dehydrate, hydrate } from "@tanstack/react-query"
import { createRouter, ErrorComponent } from "@tanstack/react-router"
import type { AstroGlobal } from "astro"
import { ThemeProvider } from "next-themes"
import * as React from "react"

export function createAppRouter(astro?: AstroGlobal) {
  const tanstackQueryContext = getTanstackQueryContext()

  const router = createRouter({
    routeTree,
    context: { astro, ...tanstackQueryContext },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    dehydrate: () => {
      return {
        queryClientState: dehydrate(tanstackQueryContext.queryClient),
      }
    },
    hydrate: (dehydrated) => {
      hydrate(tanstackQueryContext.queryClient, dehydrated.queryClientState)
    },
    Wrap: ({ children }: { children: React.ReactNode }) => {
      return (
        <React.StrictMode>
          <TanstackQueryProvider {...tanstackQueryContext}>
            <ThemeProvider attribute="class">
              <TooltipProvider>{children}</TooltipProvider>
            </ThemeProvider>
          </TanstackQueryProvider>
        </React.StrictMode>
      )
    },
    defaultPendingComponent: DefaultPendingPage,
    defaultNotFoundComponent: () => (
      <div className="flex flex-1 flex-col">
        <NotFoundMainSection />
      </div>
    ),
    defaultErrorComponent: ({ error }) => {
      return (
        <div className="flex flex-1 flex-col">
          {isDev ? <ErrorComponent error={error} /> : <ErrorMainSection />}
        </div>
      )
    },
    defaultViewTransition: true,
    scrollRestoration: true,
    defaultPreload: "intent",
  })

  return router
}

export type AppRouter = ReturnType<typeof createAppRouter>

declare module "@tanstack/react-router" {
  interface Register {
    router: AppRouter
  }

  interface StaticDataRouteOption {
    creationMode?: boolean
    editMode?: boolean
    manualMode?: boolean
    aiMode?: boolean
  }
}
