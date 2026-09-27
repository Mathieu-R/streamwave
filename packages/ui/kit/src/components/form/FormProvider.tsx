import { createContext, PropsWithChildren, useContext } from 'react'
import { FormProvider as FormProviderBase } from 'react-hook-form'
import type { AnyZodObject, UseFormReturnZod } from '@streamwave/core/zod'

type FormProviderProps<Schema extends AnyZodObject> = PropsWithChildren<{
  schema: Schema
}> &
  UseFormReturnZod<Schema>

const FormSchemaContext = createContext<AnyZodObject | null>(null)

export const FormProvider = <Schema extends AnyZodObject>({
  children,
  schema,
  ...props
}: FormProviderProps<Schema>) => {
  return (
    <FormSchemaContext.Provider value={schema}>
      <FormProviderBase {...props}>{children}</FormProviderBase>
    </FormSchemaContext.Provider>
  )
}

export const useFieldRequired = (name: string) => {
  const schema = useContext(FormSchemaContext)

  if (!schema) {
    throw new Error('useFieldRequired must be used within a FormProvider.')
  }

  const fieldSchema = schema.shape[name]

  if (!fieldSchema) {
    throw new Error(`Field "${name}" does not exist in the form schema.`)
  }

  return !fieldSchema.isOptional()
}
