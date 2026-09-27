import type { ComponentProps, ReactNode } from 'react'
import { useController } from 'react-hook-form'
import { Field } from '@chakra-ui/react/field'
import { Input } from '@chakra-ui/react/input'
import { InputGroup } from '@chakra-ui/react'
import { useFieldRequired } from '../form/FormProvider'

type TextInputBaseProps = {
  label: ReactNode
  placeholder?: string
  icon?: ReactNode
  autoComplete?: string
  type?: ComponentProps<'input'>['type']
  value?: string
  onChange: (value: string) => void | Promise<void>
  required?: boolean
  error?: string
}

export const TextInputBase = ({
  label,
  placeholder,
  icon,
  autoComplete,
  type,
  value,
  onChange,
  required,
  error
}: TextInputBaseProps) => {
  return (
    <Field.Root required={required} invalid={Boolean(error)}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <InputGroup startElement={icon}>
        <Input
          autoComplete={autoComplete}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(evt) => onChange(evt.currentTarget.value)}
        />
      </InputGroup>
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
}

export const TextInput = ({
  name,
  ...props
}: { name: string } & Pick<
  TextInputBaseProps,
  'autoComplete' | 'label' | 'placeholder' | 'icon' | 'type'
>) => {
  const { field, fieldState } = useController({ name })
  const required = useFieldRequired(name)

  return (
    <TextInputBase
      {...props}
      value={field.value as string}
      onChange={field.onChange}
      required={required}
      error={fieldState.error?.message}
    />
  )
}
