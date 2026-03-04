import {
  Field,
  FieldError,
  FieldLabel,
} from "@healthcare/web/core/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
} from "@healthcare/web/core/components/ui/input-group"
import { Textarea } from "@healthcare/web/core/components/ui/textarea"
import type { ClassNameProp } from "@healthcare/web/core/kit/component-kit"
import {
  Controller,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form"

// Component
interface ControlledTextareaProps<
  TIconProps extends ClassNameProp = ClassNameProp,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> extends UseControllerProps<TFieldValues, TName, TTransformedValues> {
  label?: React.ReactNode
  textareaProps?: React.ComponentProps<typeof Textarea>
  labelProps?: React.ComponentProps<typeof FieldLabel>
  errorProps?: React.ComponentProps<typeof FieldError>
  icon?: React.FunctionComponent<TIconProps>
  iconProps?: TIconProps
}

export function ControlledTextarea<
  TIconProps extends ClassNameProp = ClassNameProp,
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
  iconProps = {} as TIconProps,
  ...props
}: ControlledTextareaProps<TIconProps, TFieldValues, TName>) {
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
            <Textarea
              id={name}
              className={textareaClassName}
              aria-invalid={fieldState.invalid}
              {...field}
              {...textareaProps}
            />

            {Icon && (
              <InputGroupAddon align="inline-end">
                <Icon {...iconProps} className={iconProps.className} />
              </InputGroupAddon>
            )}
          </InputGroup>

          {fieldState.invalid && (
            <FieldError
              className={errorClassName}
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
