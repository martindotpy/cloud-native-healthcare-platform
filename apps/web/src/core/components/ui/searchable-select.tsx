import { Input } from "@healthcare/web/core/components/ui/input"
import { cn } from "@healthcare/web/core/lib/tailwind"
import { useEffect, useMemo, useRef, useState } from "react"
import { TbCheck, TbSelector } from "react-icons/tb"

export interface SearchableSelectOption {
  value: string
  label: string
  keywords?: string
}

interface SearchableSelectProps {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: SearchableSelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  disabled?: boolean
}

function SearchableSelect({
  id,
  value,
  onValueChange,
  options,
  placeholder = "Selecciona una opcion",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No hay resultados",
  className,
  disabled,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const rootRef = useRef<HTMLDivElement | null>(null)

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    if (!normalizedSearchTerm) return options

    return options.filter((option) => {
      const normalizedLabel = option.label.toLowerCase()
      const normalizedKeywords = option.keywords?.toLowerCase() ?? ""
      return (
        normalizedLabel.includes(normalizedSearchTerm) ||
        normalizedKeywords.includes(normalizedSearchTerm)
      )
    })
  }, [options, searchTerm])

  useEffect(() => {
    if (!isOpen) return

    const handleOutsideClick = (event: MouseEvent) => {
      if (!rootRef.current) return
      if (rootRef.current.contains(event.target as Node)) return
      setIsOpen(false)
      setSearchTerm("")
    }

    document.addEventListener("mousedown", handleOutsideClick)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [isOpen])

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        onClick={() => {
          setIsOpen((previous) => {
            const next = !previous
            if (!next) setSearchTerm("")
            return next
          })
        }}
        className={cn(
          "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 flex h-9 w-full items-center justify-between gap-2 rounded-md border bg-transparent px-2.5 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        <span
          className={cn(
            "truncate text-left",
            selectedOption ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <TbSelector className="text-muted-foreground size-4 shrink-0" />
      </button>

      {isOpen && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border p-2 shadow-md">
          <Input
            autoFocus
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder={searchPlaceholder}
          />

          <div className="mt-2 max-h-60 overflow-y-auto pr-1">
            {filteredOptions.length === 0 ? (
              <p className="text-muted-foreground px-2 py-2 text-sm">
                {emptyMessage}
              </p>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-left text-sm",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onValueChange(option.value)
                      setIsOpen(false)
                      setSearchTerm("")
                    }}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <TbCheck className="size-4 shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export { SearchableSelect }
