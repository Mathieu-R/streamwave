import vine from '@vinejs/vine'

const userSchema = vine.object({
  email: vine.string().trim().normalizeEmail().email(),
  password: vine.string().trim().minLength(8),
})

export const registerValidator = vine.compile(
  vine.object({
    firstname: vine.string().trim().minLength(3),
    lastname: vine.string().trim().minLength(3),
    ...userSchema.getProperties(),
  })
)

export const tokenValidator = vine.compile(
  vine.object({
    token: vine.string().trim(),
  })
)

export const loginValidator = vine.compile(
  vine.object({
    ...userSchema.getProperties(),
  })
)

export const getResetTokenValidator = vine.compile(
  vine.object({
    email: vine.string().trim().normalizeEmail().email(),
  })
)

export const resetPasswordValidator = vine.compile(
  vine.object({
    password: vine.string().trim().minLength(8),
  })
)
