import type {
  ChangeEventHandler,
  FocusEventHandler,
  ReactNode,
  RefCallback
} from 'react'
import { useController } from 'react-hook-form'
import { Field } from '@chakra-ui/react/field'
import {
  PasswordInput as ChakraPasswordInput,
  PasswordStrengthMeter
} from './password-input'
import { useFieldRequired } from '../form/FormProvider'

type PasswordInputBaseProps = {
  label: ReactNode
  placeholder?: string
  icon?: ReactNode
  value?: string
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  inputRef?: RefCallback<HTMLInputElement>
  name?: string
  autoComplete?: string
  required?: boolean
  error?: string
  showStrengthMeter?: boolean
}

const getPasswordStrength = (password: string) => {
  if (!password) return 0

  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const hasNumberAndSymbol = /\d/.test(password) && /[^\w\s]/.test(password)

  return Math.min(
    4,
    Number(password.length >= 8) +
      Number(password.length >= 12) +
      Number(hasMixedCase) +
      Number(hasNumberAndSymbol)
  )
}

export const PasswordInputBase = ({
  label,
  placeholder,
  icon,
  value,
  onChange,
  onBlur,
  inputRef,
  name,
  autoComplete,
  required,
  error,
  showStrengthMeter = false
}: PasswordInputBaseProps) => {
  const password = value ?? ''

  return (
    <Field.Root required={required} invalid={Boolean(error)}>
      <Field.Label>
        {label}
        {required && <Field.RequiredIndicator />}
      </Field.Label>
      <ChakraPasswordInput
        autoComplete={autoComplete}
        name={name}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        ref={inputRef}
        rootProps={{ startElement: icon }}
        value={password}
      />
      {showStrengthMeter && password && (
        <PasswordStrengthMeter value={getPasswordStrength(password)} />
      )}
      {error && <Field.ErrorText>{error}</Field.ErrorText>}
    </Field.Root>
  )
}

export const PasswordInput = ({
  name,
  ...props
}: { name: string } & Pick<
  PasswordInputBaseProps,
  'autoComplete' | 'icon' | 'label' | 'placeholder' | 'showStrengthMeter'
>) => {
  const { field, fieldState } = useController({ name })
  const required = useFieldRequired(name)

  return (
    <PasswordInputBase
      {...props}
      value={field.value as string}
      onChange={field.onChange}
      onBlur={field.onBlur}
      inputRef={field.ref}
      name={field.name}
      required={required}
      error={fieldState.error?.message}
    />
  )
}
