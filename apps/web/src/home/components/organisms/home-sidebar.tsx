import { Banner } from "@healthcare/web/core/components/atoms/banner"
import { Brandmark } from "@healthcare/web/core/components/atoms/branmark"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@healthcare/web/core/components/ui/sidebar"
import { cn } from "@healthcare/web/core/lib/tailwind"
import { useSidebarItems } from "@healthcare/web/home/hook/use-sidebar-items"
import { Link, useLocation } from "@tanstack/react-router"

// Component
export function HomeSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Pathname
  const { pathname } = useLocation()

  const sidebarItems = useSidebarItems()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={cn(
          "overflow-hidden py-8 transition-[padding]",
          "group-data-[collapsible=icon]:px-3 group-data-[collapsible=icon]:py-4"
        )}
      >
        <Banner
          className={cn(
            "text-primary-500 mx-auto mt-4 h-8 min-h-8 w-fit min-w-35",
            "md:mt-0",
            "group-data-[collapsible=icon]:hidden"
          )}
        />
        <Brandmark className="hidden aspect-video w-6 group-data-[collapsible=icon]:block" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive =
                  item.to === "/"
                    ? // Check if the item is the home route
                      item.to === pathname
                    : // Otherwise, check if the pathname starts with the item's route
                      item.to && pathname.startsWith(item.to)

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      tooltip={item.label}
                      className="flex items-center gap-2 transition-colors group-data-[collapsible=icon]:px-1.5!"
                      isActive={isActive}
                      render={
                        <Link to={item.to} preload={false}>
                          <item.icon className="size-5!" />

                          <span>{item.label}</span>
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
