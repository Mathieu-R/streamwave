import type { ReactNode } from 'react'
import type z from 'zod/v4'
import { type DefaultValues, type FieldValues, Path } from 'react-hook-form'
import { Button, Group, Stack } from '@chakra-ui/react'
import {
  UseFormReturnZod,
  AnyZodObject,
  useFormZod
} from '@streamwave/core/zod'
import { FormProvider } from './FormProvider'

type AsyncDefaultValues<FormValues> = (payload?: unknown) => Promise<FormValues>
type InitialValues<FormValues> =
  | DefaultValues<FormValues>
  | AsyncDefaultValues<FormValues>

type FormViewOptions = {
  submit: {
    title: ReactNode
  }
}

type FormViewProps<Schema extends AnyZodObject> = {
  schema: Schema
  initialValues: InitialValues<z.input<Schema>>
  onSubmit: (values: z.infer<Schema>) => Promise<void> | void
  renderForm: ({
    form,
    field
  }: {
    form: UseFormReturnZod<Schema>
    field: ReturnType<typeof createField<z.input<Schema>>>
  }) => ReactNode
  actions?: ReactNode
  options: FormViewOptions
  isLoading?: boolean
}

const createField = <T extends FieldValues>() => {
  return <N extends Path<T>>(name: N): N => name
}

export const FormView = <Schema extends AnyZodObject>({
  schema,
  initialValues,
  onSubmit,
  actions,
  options,
  isLoading = false,
  renderForm
}: FormViewProps<Schema>) => {
  const form = useFormZod({
    schema,
    defaultValues: initialValues
  })

  return (
    <FormProvider {...form} schema={schema}>
      <form noValidate onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset
          disabled={isLoading}
          style={{ border: 0, margin: 0, minInlineSize: 0, padding: 0 }}
        >
          <Stack gap={4}>
            {renderForm({ form, field: (name) => name })}
            <Group>
              {actions}
              <Button
                disabled={isLoading || form.formState.isSubmitting}
                type="submit"
              >
                {options.submit.title}
              </Button>
            </Group>
          </Stack>
        </fieldset>
      </form>
    </FormProvider>
  )
}
