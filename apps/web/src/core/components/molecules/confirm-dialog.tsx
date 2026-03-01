import { Button } from "@healthcare/web/core/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@healthcare/web/core/components/ui/dialog"
import { TbLoader } from "react-icons/tb"

// Component
interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  confirmLabel?: React.ReactNode
  cancelLabel?: React.ReactNode
  variant?: "default" | "destructive"
  isLoading?: boolean
  onConfirm: () => void | Promise<void>
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  isLoading = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isLoading}>
                {cancelLabel}
              </Button>
            }
          />

          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <TbLoader className="size-4 animate-spin" />
                Cargando...
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
