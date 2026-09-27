import z from 'zod/v4'
import { Resolver, useForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

export const idSchema = z
  .string()
  .regex(/^[1-9]\d*$/)
  .max(50)
  .refine((id) => Number.isSafeInteger(Number(id)))

export type AnyZodObject = z.ZodObject<Record<string, z.ZodType>>

export type UseFormReturnZod<T extends AnyZodObject> = UseFormReturn<
  z.input<T>,
  unknown,
  z.infer<T>
>

export type ZodResolver<T extends AnyZodObject> = Resolver<
  z.input<T>,
  unknown,
  z.infer<T>
>

export const zodFormResolver = <T extends AnyZodObject>(
  schema: T
): ZodResolver<T> => {
  return zodResolver(schema) as unknown as ZodResolver<T>
}

export type UseFormZodOptions<T extends AnyZodObject> = Omit<
  UseFormProps<z.input<T>, unknown, z.infer<T>>,
  'resolver'
> & {
  schema: T
}

export const useFormZod = <T extends AnyZodObject>(
  options: UseFormZodOptions<T>
): UseFormReturnZod<T> => {
  const { schema, ...rest } = options
  return useForm<z.input<T>, unknown, z.infer<T>>({
    ...rest,
    resolver: zodFormResolver(schema)
  })
}
