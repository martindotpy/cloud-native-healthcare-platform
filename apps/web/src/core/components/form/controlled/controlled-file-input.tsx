import { cn } from "@healthcare/web/core/lib/tailwind"
import { useState } from "react"
import {
  Controller,
  useController,
  useWatch,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { LuCloudUpload, LuFileText } from "react-icons/lu"

// Component
interface ControlledFileInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<ControllerProps<TFieldValues, TName>, "render"> {
  label: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>
  labelTextProps?: React.HTMLAttributes<HTMLSpanElement>
  errorLabelProps?: React.HTMLAttributes<HTMLSpanElement>
}

export function ControlledFileInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  inputProps: { className: inputClassName, ...inputProps } = {},
  labelProps: { className: labelClassName, ...labelProps } = {},
  labelTextProps,
  errorLabelProps: { className: errorLabelClassName, ...errorLabelProps } = {},
  ...props
}: ControlledFileInputProps<TFieldValues, TName>) {
  // Drag and drop handler
  const [isDragging, setIsDragging] = useState(false)

  // File management
  const file = useWatch({ control, name }) as File | undefined
  const { field } = useController({ control, name })

  return (
    <label
      htmlFor={name}
      className={cn(labelClassName)}
      {...labelProps}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)

        field.onChange(e.dataTransfer?.files[0])
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false)
        }
      }}
    >
      <span {...labelTextProps}>{label}</span>

      <div
        className={cn(
          {
            "border-dashed": isDragging,
          },
          "border-input bg-input/30 hover:bg-input/50 mt-1 flex h-52 w-full cursor-pointer flex-col items-center justify-center rounded border"
        )}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {file ? (
            <LuFileText
              className="text-primary-500 mb-4 size-10"
              aria-hidden="true"
            />
          ) : (
            <LuCloudUpload
              className="text-primary-500 mb-4 size-10"
              aria-hidden="true"
            />
          )}

          <p
            className={cn(
              "text-primary-500 mb-2 overflow-hidden px-2 text-center text-ellipsis",
              "xs:max-w-xs",
              "md:max-w-md",
              "lg:max-w-lg"
            )}
          >
            {file ? (
              `${file.name}`
            ) : !isDragging ? (
              <>
                <span className="font-semibold">Click para subir</span> o{" "}
                <span className="font-semibold">arrastra y suelta</span> tu
                archivo aquí
              </>
            ) : (
              <span className="font-semibold">Suelta el archivo aquí</span>
            )}
          </p>
        </div>
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <>
            <input
              id={name}
              name={name}
              type="file"
              onChange={(e) => {
                const file = e.target?.files?.[0]

                if (file) field.onChange(file)
              }}
              hidden
              className={cn("hidden", inputClassName)}
              {...inputProps}
            />

            {error && (
              <span
                key={error.message}
                className={cn("text-xs text-red-400", errorLabelClassName)}
                {...errorLabelProps}
              >
                {error.message}
              </span>
            )}
          </>
        )}
        {...props}
      />
    </label>
  )
}
