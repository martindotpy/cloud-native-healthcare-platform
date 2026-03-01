import { Button } from "@healthcare/web/core/components/ui/button"
import { Input } from "@healthcare/web/core/components/ui/input"
import { cn } from "@healthcare/web/core/lib/tailwind"
import {
  NumberField,
  type NumberFieldGroupProps,
  type NumberFieldRootProps,
} from "@base-ui/react/number-field"
import { TbMinus, TbPlus } from "react-icons/tb"

export interface NumberInputProps extends NumberFieldRootProps {
  groupProps?: NumberFieldGroupProps
  decrementProps?: React.ComponentProps<typeof NumberField.Decrement>
  incrementProps?: React.ComponentProps<typeof NumberField.Increment>
  inputProps?: React.ComponentProps<typeof NumberField.Input> &
    React.ComponentProps<typeof Input>
}

export function NumberInput({
  groupProps,
  decrementProps,
  incrementProps,
  inputProps,
  ...props
}: NumberInputProps) {
  return (
    <NumberField.Root {...props}>
      <NumberField.Group
        {...groupProps}
        className={cn(groupProps?.className, "flex")}
      >
        <NumberField.Decrement
          {...decrementProps}
          render={(props) => (
            <Button size="icon" {...props}>
              <TbMinus />
            </Button>
          )}
        />
        <NumberField.Input
          {...inputProps}
          render={(props) => <Input {...props} />}
        />
        <NumberField.Increment
          {...incrementProps}
          render={(props) => (
            <Button size="icon" {...props}>
              <TbPlus />
            </Button>
          )}
        />
      </NumberField.Group>
    </NumberField.Root>
  )
}
