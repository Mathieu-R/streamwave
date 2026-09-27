import { Controller } from 'react-hook-form'

type ManagedFieldProps =
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'onBlur'
  | 'name'

export type ControlledFieldProps<P> = Omit<P, ManagedFieldProps | 'ref'> & {
  name: string
  onChange?: P extends { onChange?: infer H } ? H : never
}

export const controlled = <
  P extends {
    name: string
    value?: unknown
    onChange?: (...args: never[]) => void
  }
>(
  Component: React.ComponentType<P>
) => {
  return ({
    name,
    onChange: givenOnChange,
    ...props
  }: ControlledFieldProps<P>) => (
    <Controller
      name={name}
      render={({ field }) => (
        <Component
          {...(props as P)}
          name={name}
          ref={field.ref}
          value={field.value as P['value']}
          onBlur={field.onBlur}
          onChange={(event) => {
            field.onChange(event)
            givenOnChange?.(event)
          }}
        />
      )}
    />
  )
}
