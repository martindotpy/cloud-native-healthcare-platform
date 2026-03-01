import { TbLoader } from "react-icons/tb"

// Component
export function DefaultPendingPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-2">
      <TbLoader className="size-14 animate-spin" />
      Cargando...
    </div>
  )
}
