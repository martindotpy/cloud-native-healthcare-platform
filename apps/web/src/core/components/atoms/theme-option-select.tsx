import { Button } from "@healthcare/web/core/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@healthcare/web/core/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"
import { TbMoon, TbSun, TbSunMoon } from "react-icons/tb"

// Messages
const messages = {
  system: "Sistema",
  light: "Claro",
  dark: "Oscuro",
}

const icons = {
  system: TbSunMoon,
  light: TbSun,
  dark: TbMoon,
}

// Component
export function ThemeOptionSelect() {
  // Theme
  const { theme = "system", themes, setTheme } = useTheme()

  // Select
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (!selectRef.current) return

    selectRef.current.value = theme || "system"
  }, [theme])

  // Icon
  const Icon = icons[theme as keyof typeof icons]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon-lg">
            <Icon className="size-5" />
          </Button>
        }
      />
      <DropdownMenuContent>
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption}
            onClick={() => setTheme(themeOption)}
            disabled={themeOption === theme}
          >
            {messages[themeOption as keyof typeof messages]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
