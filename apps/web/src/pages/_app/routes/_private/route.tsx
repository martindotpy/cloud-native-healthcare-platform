import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_private")({
  beforeLoad: ({ location, context }) => {
    if (!context.auth) {
      const redirectTo = location.href === "/" ? undefined : location.href

      throw redirect({ to: "/login", search: { redirect: redirectTo } })
    }

    return { auth: context.auth }
  },
})
