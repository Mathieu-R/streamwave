import { render } from '@react-email/render'
import { createTransport } from 'nodemailer'
import { createElement } from 'react'
import { Resend } from 'resend'
import { AuthEmailTemplate } from './authEmail'

export type AuthEmail = {
  type: 'verify-email' | 'reset-password'
  email: string
  name: string
  url: string
}

function getSubject(type: AuthEmail['type']) {
  return type === 'verify-email'
    ? 'Streamwave - Confirmez votre adresse e-mail'
    : 'Streamwave - Réinitialisez votre mot de passe'
}

export async function sendAuthEmail(email: AuthEmail) {
  const html = await render(createElement(AuthEmailTemplate, { email }))
  const subject = getSubject(email.type)

  if (process.env.NODE_ENV === 'production') {
    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.MAIL_FROM

    if (!apiKey || !from) {
      throw new Error('RESEND_API_KEY and MAIL_FROM are required in production')
    }

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from,
      to: [email.email],
      subject,
      html
    })

    if (error) {
      throw new Error(error.message)
    }

    return
  }

  const transporter = createTransport({
    host: process.env.SMTP_HOST ?? 'localhost',
    port: Number(process.env.SMTP_PORT ?? '1025'),
    secure: false
  })

  await transporter.sendMail({
    from: process.env.MAIL_FROM ?? 'Streamwave <no-reply@streamwave.local>',
    to: email.email,
    subject,
    html
  })
}
