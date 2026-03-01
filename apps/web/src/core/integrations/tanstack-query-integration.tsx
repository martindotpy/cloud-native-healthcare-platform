import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Context
// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient()

// eslint-disable-next-line react-refresh/only-export-components
export function getTanstackQueryContext() {
  return {
    queryClient,
  }
}

// Provider
interface TanstackQueryProviderProps {
  queryClient: QueryClient
  children: React.ReactNode
}

export function TanstackQueryProvider({
  children,
  queryClient,
}: TanstackQueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
