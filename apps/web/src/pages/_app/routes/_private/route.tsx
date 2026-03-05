import {
  SidebarInset,
  SidebarProvider,
} from "@healthcare/web/core/components/ui/sidebar"
import { HomeHeader } from "@healthcare/web/home/components/organisms/home-header"
import { HomeSidebar } from "@healthcare/web/home/components/organisms/home-sidebar"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

// Layout
export const Route = createFileRoute("/_private")({
  beforeLoad: ({ location, context }) => {
    if (!context.auth) {
      const redirectTo = location.href === "/" ? undefined : location.href

      throw redirect({ to: "/login", search: { redirect: redirectTo } })
    }

    return { auth: context.auth }
  },
  component: PrivateLayoutComponent,
})

function PrivateLayoutComponent() {
  return (
    <SidebarProvider>
      <HomeSidebar />

      <SidebarInset className="gap-5 p-5">
        <HomeHeader />

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
