import type { TanStackDevtoolsReactPlugin } from "@tanstack/react-devtools"
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools"

// Devtools
export const tanstackQueryDevtools: TanStackDevtoolsReactPlugin = {
  name: "Tanstack Query",
  render: <ReactQueryDevtoolsPanel />,
}
