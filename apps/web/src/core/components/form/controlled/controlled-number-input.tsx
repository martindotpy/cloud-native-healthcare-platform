import {
  Field,
  FieldError,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
} from "@healthcare/web/core/components/ui/input-group"
import {
  NumberInput,
  type NumberInputProps,
} from "@healthcare/web/core/components/ui/number-input"
import type { ClassNameProp } from "@healthcare/web/core/kit/component-kit"
import { cn } from "@healthcare/web/core/lib/tailwind"
import {
  Controller,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import type z from "zod"

// Component
interface ControlledNumberInputProps<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label?: React.ReactNode
  schema?: z.ZodNumber
  numberInputProps?: NumberInputProps
  labelProps?: React.HTMLAttributes<HTMLLabelElement>
  errorProps?: React.HTMLAttributes<HTMLSpanElement>
  icon?: React.FunctionComponent<TIconProps>
  iconProps?: TIconProps
}

export function ControlledNumberInput<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  schema,
  numberInputProps: { className: numberInputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  icon: Icon,
  iconProps = {} as TIconProps,
  ...props
}: ControlledNumberInputProps<TIconProps, TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name} className={labelClassName} {...labelProps}>
            {label}
          </FieldLabel>

          <InputGroup>
            <NumberInput
              id={name}
              className={numberInputClassName}
              aria-invalid={fieldState.invalid}
              min={schema?.minValue ?? undefined}
              max={schema?.maxValue ?? undefined}
              {...inputProps}
              {...field}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={undefined}
              value={field.value}
              defaultValue={field.value}
              onValueChange={(value) => field.onChange(value)}
            />

            {Icon && (
              <InputGroupAddon align="inline-end">
                <Icon {...iconProps} className={cn(iconProps.className)} />
              </InputGroupAddon>
            )}
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
