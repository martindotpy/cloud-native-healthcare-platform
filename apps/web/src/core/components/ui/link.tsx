import {
  Button,
  buttonVariants,
} from "@healthcare/web/core/components/ui/button"
import {
  Link as RouterLink,
  type LinkComponentProps,
} from "@tanstack/react-router"
import type { VariantProps } from "class-variance-authority"

// Types
type ButtonWithoutVariantProps = Omit<
  React.ComponentProps<typeof Button>,
  keyof VariantProps<typeof buttonVariants> | "nativeButton"
>

// Component
interface LinkProps
  extends LinkComponentProps, VariantProps<typeof buttonVariants> {
  buttonProps?: ButtonWithoutVariantProps
}

export function Link({
  variant = "link",
  size,
  buttonProps,
  ...props
}: LinkProps) {
  return (
    <Button
      variant={variant}
      size={size}
      nativeButton={false}
      {...buttonProps}
      render={<RouterLink {...props}></RouterLink>}
    />
  )
}
