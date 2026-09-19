import crypto from 'node:crypto'
import User, { Provider } from '#models/user'
import { DateTime } from 'luxon'
import mail from '@adonisjs/mail/services/main'

export default class LocalAuthService {
  // @ts-ignore
  createUser(payload) {
    // generate a token for email verification
    const token = crypto.randomBytes(20).toString('hex')
    return User.create({
      ...payload,
      provider: Provider.LOCAL,
      emailVerificationToken: token,
      emailVerificationTokenExpiredAt: DateTime.now().plus({ days: 1 }),
    })
  }

  sendVerificationEmail(host: string, user: User) {
    const url = `${host}/validate?token=${user.emailVerificationToken}`

    // queue the email
    return mail.sendLater((message) => {
      message
        .to(user.email)
        .subject('Streamwave - Activate your account')
        .htmlView('emails/activate_account', {
          firstname: user.firstname,
          lastname: user.lastname,
          url,
        })
    })
  }

  validateAccount(user: User) {
    user.emailVerificationToken = null
    user.emailVerificationTokenExpiredAt = null
    user.emailVerified = true

    return user.save()
  }

  async sendResetPasswordEmail(host: string, user: User) {
    const token = crypto.randomBytes(20).toString('hex')

    user.resetPasswordToken = token
    user.resetPasswordTokenExpiredAt = DateTime.now().plus({ hours: 1 })
    await user.save()

    const url = `${host}/reset-password/check-reset-token?token=${token}`

    // queue the email
    return mail.sendLater((message) => {
      message
        .to(user.email)
        .subject('Streamwave - Reset password request')
        .htmlView('emails/reset_password', {
          firstname: user.firstname,
          lastname: user.lastname,
          url,
        })
    })
  }

  checkResetToken(token: string) {
    return User.query()
      .where((query) => {
        return query
          .where('provider', Provider.LOCAL)
          .where('resetPasswordToken', token)
          .where('resetPasswordTokenExpiredAt', '>', DateTime.now().toSQLDate())
      })
      .first()
  }
}
