import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"

// Devtools
export const tanstackRouterDevtools: TanStackDevtoolsReactPlugin = {
  name: "Tanstack Router",
  render: <TanStackRouterDevtoolsPanel />,
}
