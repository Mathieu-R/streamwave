import { renderToStaticMarkup } from 'react-dom/server'
import { useForm } from 'react-hook-form'
import { describe, expect, it } from 'vitest'
import { z } from 'zod/v4'
import { FormProvider, useFieldRequired } from './FormProvider'

const formSchema = z.object({
  nullable: z.string().nullable(),
  optional: z.string().optional(),
  required: z.string()
})

const RequiredField = ({ name }: { name: string }) => {
  return <span>{String(useFieldRequired(name))}</span>
}

const TestForm = () => {
  const form = useForm<z.input<typeof formSchema>>({
    defaultValues: {
      nullable: null,
      optional: undefined,
      required: ''
    }
  })

  return (
    <FormProvider {...form} schema={formSchema}>
      <RequiredField name="required" />
      <RequiredField name="optional" />
      <RequiredField name="nullable" />
    </FormProvider>
  )
}

const MissingFieldForm = () => {
  const form = useForm<z.input<typeof formSchema>>({
    defaultValues: { required: '' }
  })

  return (
    <FormProvider {...form} schema={formSchema}>
      <RequiredField name="missing" />
    </FormProvider>
  )
}

describe('FormProvider', () => {
  it('derives required fields from the Zod schema', () => {
    expect(renderToStaticMarkup(<TestForm />)).toBe(
      '<span>true</span><span>false</span><span>true</span>'
    )
  })

  it('throws when a field is absent from the schema', () => {
    expect(() => renderToStaticMarkup(<MissingFieldForm />)).toThrow(
      'Field "missing" does not exist in the form schema.'
    )
  })

  it('throws outside a FormProvider', () => {
    expect(() =>
      renderToStaticMarkup(<RequiredField name="required" />)
    ).toThrow('useFieldRequired must be used within a FormProvider.')
  })
})
