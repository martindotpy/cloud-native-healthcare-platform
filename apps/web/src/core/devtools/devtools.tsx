import { isDev } from "@healthcare/web/core/configuration/app-configuration"
import { tanstackQueryDevtools } from "@healthcare/web/core/devtools/tanstack-query-devtools"
import { tanstackRouterDevtools } from "@healthcare/web/core/devtools/tanstack-router-devtools"
import { TanStackDevtools } from "@tanstack/react-devtools"

// Component
export function Devtools() {
  return (
    isDev && (
      <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[tanstackRouterDevtools, tanstackQueryDevtools]}
      />
    )
  )
}
