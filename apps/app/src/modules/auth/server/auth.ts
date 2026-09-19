import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { inngest } from '@streamwave/inngest'
import * as schema from '@streamwave/drizzle/schema'
import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { db } from '../../../libs/drizzle'

export const auth = betterAuth({
  appName: 'Streamwave',
  baseURL: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema
  }),
  user: {
    additionalFields: {
      firstname: { type: 'string', required: false },
      lastname: { type: 'string', required: false }
    }
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendOnSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await inngest.send({
        name: 'auth/email.requested',
        data: {
          type: 'reset-password',
          email: user.email,
          name: user.name,
          url
        }
      })
    }
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await inngest.send({
        name: 'auth/email.requested',
        data: { type: 'verify-email', email: user.email, name: user.name, url }
      })
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ''
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    }
  },
  account: {
    accountLinking: {
      trustedProviders: ['google', 'github']
    }
  },
  plugins: [tanstackStartCookies()]
})
