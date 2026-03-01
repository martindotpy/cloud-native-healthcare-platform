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
import { Input } from "@healthcare/web/core/components/ui/input"
import type { ClassNameProp } from "@healthcare/web/core/kit/component-kit"
import { cn } from "@healthcare/web/core/lib/tailwind"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"

// Component
interface ControlledInputProps<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  label?: React.ReactNode
  inputProps?: React.ComponentProps<typeof Input>
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
  icon?: React.FunctionComponent<TIconProps>
  iconProps?: TIconProps
}

export function ControlledInput<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  inputProps: { className: inputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  errorProps: { className: errorClassName, ...errorProps } = {},
  icon: Icon,
  iconProps = {} as TIconProps,
  ...props
}: ControlledInputProps<TIconProps, TFieldValues, TName>) {
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
              <Input
                id={name}
                type="text"
                className={cn(
                  { [inputWithIconBaseClassName]: Boolean(Icon) },
                  inputClassName
                )}
                aria-invalid={fieldState.invalid}
                {...field}
                {...inputProps}
              />

              {Icon && (
                <Icon
                  {...iconProps}
                  className={cn(
                    svgInputBaseClassName,
                    "peer",
                    iconProps.className
                  )}
                />
              )}
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
