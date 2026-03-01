import {
  inputWithIconBaseClassName,
  labelBaseClassName,
  svgInputBaseClassName,
} from "@healthcare/web/core/components/form/styles/input-styles"
import {
  Field,
  FieldError,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import { Textarea } from "@healthcare/web/core/components/ui/textarea"
import { cn } from "@healthcare/web/core/lib/tailwind"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"

// Component
interface ControlledTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  label?: React.ReactNode
  textareaProps?: React.ComponentProps<typeof Textarea>
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
  icon?: React.FunctionComponent<{ className?: string }>
}

export function ControlledTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  textareaProps: { className: textareaClassName, ...textareaProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  icon: Icon,
  ...props
}: ControlledTextareaProps<TFieldValues, TName>) {
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

            <div className="relative">
              <Textarea
                id={name}
                className={cn(
                  { [inputWithIconBaseClassName]: Boolean(Icon) },
                  textareaClassName
                )}
                aria-invalid={fieldState.invalid}
                {...field}
                {...textareaProps}
              />
              {Icon && <Icon className={cn(svgInputBaseClassName, "peer")} />}
            </div>

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
