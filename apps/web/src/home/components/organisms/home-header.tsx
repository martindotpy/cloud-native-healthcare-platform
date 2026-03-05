import { authClient } from "@healthcare/web/auth/client/auth-client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@healthcare/web/core/components/ui/avatar"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@healthcare/web/core/components/ui/menubar"
import { SidebarTrigger } from "@healthcare/web/core/components/ui/sidebar"
import { Route as PrivateRoute } from "@healthcare/web/pages/_app/routes/_private/route"
import { useNavigate } from "@tanstack/react-router"
import { TbChevronDown, TbLogout } from "react-icons/tb"
import { toast } from "sonner"

// Component
export function HomeHeader() {
  // Navigator
  const navigate = useNavigate()

  // Auth data
  const { auth } = PrivateRoute.useRouteContext()

  // Handler for logout
  const handleLogout = () => {
    authClient
      .signOut()
      .then(() => {
        toast.success("¡Nos vemos pronto!")

        navigate({ to: "/" })
      })
      .catch((error) => {
        console.error("Error during logout:", error)

        toast.error("Error al cerrar sesión. Inténtalo de nuevo más tarde.")
      })
  }

  return (
    <header className="bg-sidebar flex h-(--header-height) shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <SidebarTrigger />

      <Menubar className="flex flex-1 justify-end" unstyled>
        <MenubarMenu>
          <MenubarTrigger
            className="flex cursor-pointer items-center justify-end gap-2"
            unstyled
          >
            <Avatar className="mr-1">
              {auth.user.image && (
                <AvatarImage
                  src={auth.user.image}
                  alt={`${auth.user.name} ${auth.user.lastName}`}
                />
              )}
              <AvatarFallback>
                {auth.user.name.charAt(0)}
                {auth.user.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <span>
              {auth.user.name} {auth.user.lastName}
            </span>

            <TbChevronDown className="size-5 transition-[rotate] group-data-[state=open]/menubar-trigger:rotate-180" />
          </MenubarTrigger>
          <MenubarContent align="end">
            <MenubarItem onClick={handleLogout}>
              <TbLogout />
              Cerrar sesión
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  )
}
