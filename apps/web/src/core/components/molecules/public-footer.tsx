import { ThemeOptionSelect } from "@healthcare/web/core/components/atoms/theme-option-select"
import { buttonVariants } from "@healthcare/web/core/components/ui/button"
import { cn } from "@healthcare/web/core/lib/tailwind"
import { TbFileInfo } from "react-icons/tb"

// Component
export function PublicFooter() {
  return (
    <footer className="fixed bottom-0 left-0 flex w-full items-center justify-center px-5 py-2">
      <a
        href="/docs"
        className={cn(buttonVariants({ variant: "ghost", size: "icon-lg" }))}
      >
        <TbFileInfo className="size-5" />
      </a>

      <ThemeOptionSelect />
    </footer>
  )
}
