import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .email('Saisissez une adresse e-mail valide.')
const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères.')

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const signUpSchema = z
  .object({
    firstname: z
      .string()
      .trim()
      .min(3, 'Le prénom doit contenir au moins 3 caractères.'),
    lastname: z
      .string()
      .trim()
      .min(3, 'Le nom doit contenir au moins 3 caractères.'),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string()
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      error: 'Les mots de passe ne correspondent pas.',
      path: ['passwordConfirmation']
    }
  )

export const forgotPasswordSchema = z.object({ email: emailSchema })

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z.string()
  })
  .refine(
    ({ password, passwordConfirmation }) => password === passwordConfirmation,
    {
      error: 'Les mots de passe ne correspondent pas.',
      path: ['passwordConfirmation']
    }
  )

export type SignInValues = z.infer<typeof signInSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
