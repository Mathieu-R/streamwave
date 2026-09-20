import type { InputHTMLAttributes } from 'react'
import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path
} from 'react-hook-form'

type FormFieldProps<TValues extends FieldValues> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'defaultValue' | 'name' | 'onBlur' | 'onChange' | 'value'
> & {
  label: string
  name: Path<TValues>
}

export function FormField<TValues extends FieldValues>({
  label,
  name,
  ...props
}: FormFieldProps<TValues>) {
  const { control } = useFormContext<TValues>()

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`

        return (
          <div className="grid gap-2">
            <label className="text-sm font-medium" htmlFor={name}>
              {label}
            </label>
            <input
              {...props}
              {...field}
              aria-describedby={fieldState.error ? errorId : undefined}
              aria-invalid={Boolean(fieldState.error)}
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50 aria-invalid:border-destructive"
              id={name}
            />
            {fieldState.error && (
              <p className="text-sm text-destructive" id={errorId} role="alert">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
