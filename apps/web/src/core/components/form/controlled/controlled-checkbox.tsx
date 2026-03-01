import { labelBaseClassName } from "@healthcare/web/core/components/form/styles/input-styles"
import { Checkbox } from "@healthcare/web/core/components/ui/checkbox"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { cn } from "@healthcare/web/core/lib/tailwind"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"

// Component
interface ControlledCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  label?: React.ReactNode
  inputProps?: React.ComponentProps<typeof Checkbox>
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
}

export function ControlledCheckbox<
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
}: ControlledCheckboxProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel
            htmlFor={name}
            className={cn(labelBaseClassName, labelClassName)}
            {...labelProps}
          >
            {label}

            <Checkbox
              id={name}
              className={cn(inputClassName)}
              {...field}
              checked={field.value}
              defaultChecked={field.value}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              onChange={undefined}
              onCheckedChange={field.onChange}
              {...inputProps}
            />

            {fieldState.invalid && (
              <FieldError
                className={cn(errorClassName)}
                {...errorProps}
                errors={[fieldState.error]}
              />
            )}
          </FieldLabel>
        </Field>
      )}
      {...props}
    />
  )
}
