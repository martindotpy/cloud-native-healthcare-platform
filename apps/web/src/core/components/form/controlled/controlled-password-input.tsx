import {
  Field,
  FieldError,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { Input } from "@healthcare/web/core/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@healthcare/web/core/components/ui/input-group"
import { cn } from "@healthcare/web/core/lib/tailwind"
import { useEffect, useRef, useState } from "react"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"
import { TbEye, TbEyeOff } from "react-icons/tb"

// Component
interface ControlledPasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  label?: React.ReactNode
  inputProps?: React.ComponentProps<typeof Input>
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
}

export function ControlledPasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  inputProps: { className: inputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  ...props
}: ControlledPasswordInputProps<TFieldValues, TName>) {
  // Show password
  const [showPassword, setShowPassword] = useState(false)

  // Input ref
  const labelRef = useRef<HTMLLabelElement>(null)
  const isFirstRenderRef = useRef(false)

  useEffect(() => {
    if (!labelRef.current || !labelRef.current.control) return

    // Prevent auto-focus on first render when the password is visible by default
    if (!isFirstRenderRef.current) {
      isFirstRenderRef.current = true

      return
    }

    const input = labelRef.current.control as HTMLInputElement
    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
  }, [showPassword])

  useEffect(() => {
    return () => {
      isFirstRenderRef.current = false
    }
  }, [])

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            ref={labelRef}
            htmlFor={name}
            className={labelClassName}
            {...labelProps}
          >
            {label}
          </FieldLabel>

          <InputGroup>
            <InputGroupInput
              id={name}
              type={showPassword ? "text" : "password"}
              className={cn(
                "[[type=password]]:tracking-widest",
                inputClassName
              )}
              aria-invalid={fieldState.invalid}
              {...field}
              {...inputProps}
            />

            <InputGroupAddon
              align="inline-end"
              onClick={() => setShowPassword((prev) => !prev)}
              className="cursor-pointer"
            >
              {showPassword ? <TbEyeOff /> : <TbEye />}
            </InputGroupAddon>
          </InputGroup>

          {fieldState.invalid && (
            <FieldError
              className={cn(errorClassName)}
              {...errorProps}
              errors={[fieldState.error]}
            />
          )}
        </Field>
      )}
      {...props}
    />
  )
}
