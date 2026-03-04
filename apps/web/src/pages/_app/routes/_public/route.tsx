import { PublicFooter } from "@healthcare/web/core/components/molecules/public-footer"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import z from "zod"

// Layout
export const Route = createFileRoute("/_public")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (context.auth) throw redirect({ to: "/" })

    return { auth: context.auth }
  },
  component: PublicLayoutComponent,
})

function PublicLayoutComponent() {
  return (
    <>
      <main className="flex flex-1 flex-col items-center justify-center px-5 pt-8 pb-6">
        <Outlet />
      </main>

      <PublicFooter />
    </>
  )
}
