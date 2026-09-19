import { sql } from 'drizzle-orm'
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  unique,
  varchar
} from 'drizzle-orm/pg-core'

export const provider = pgEnum('provider', ['LOCAL', 'GOOGLE', 'GITHUB'])

export const user = pgTable(
  'user',
  {
    id: serial('id').primaryKey(),
    firstname: varchar('firstname').notNull(),
    lastname: varchar('lastname').notNull(),
    email: varchar('email').notNull(),
    password: varchar('password').notNull(),
    avatarUrl: varchar('avatar_url')
      .notNull()
      .default('/resources/assets/svg/avatar.svg'),
    provider: provider('provider').notNull(),
    emailVerificationToken: varchar('email_verification_token'),
    emailVerificationTokenExpiredAt: timestamp(
      'email_verification_token_expired_at',
      { mode: 'date' }
    ),
    emailVerified: boolean('email_verified').notNull().default(false),
    resetPasswordToken: varchar('reset_password_token'),
    resetPasswordTokenExpiredAt: timestamp('reset_password_token_expired_at', {
      mode: 'date'
    }),
    createdAt: timestamp('created_at', { mode: 'date' })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { mode: 'date' })
      .notNull()
      .default(sql`now()`)
      .$onUpdate(() => new Date())
  },
  (table) => [
    unique('user_email_provider_unique').on(table.email, table.provider)
  ]
)

export type User = typeof user.$inferSelect
export type NewUser = typeof user.$inferInsert
