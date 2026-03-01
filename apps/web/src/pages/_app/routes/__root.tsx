import { authClient } from "@healthcare/web/auth/client/auth-client"
import { TooltipProvider } from "@healthcare/web/core/components/ui/tooltip"
import { isSsr } from "@healthcare/web/core/configuration/app-configuration"
import { Devtools } from "@healthcare/web/core/devtools/devtools"
import { getTitle } from "@healthcare/web/core/kit/title-kit"
import type { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import type { AstroGlobal } from "astro"

// Route
interface RootRouteContext {
  astro: AstroGlobal | undefined
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RootRouteContext>()({
  beforeLoad: async () => {
    if (isSsr) return { auth: null }

    const auth = await authClient.getSession()

    if (auth.error) throw new Error("Failed to load authentication session")

    return { auth: auth.data }
  },
  head: () => ({ meta: [{ title: getTitle() }] }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <TooltipProvider>
        <Outlet />
      </TooltipProvider>

      <Devtools />
    </>
  )
}
