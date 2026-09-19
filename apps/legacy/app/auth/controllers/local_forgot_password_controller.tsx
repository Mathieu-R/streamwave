import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LocalAuthService from '../services/local_auth_service.js'
import { getResetTokenValidator } from '../validators/local_auth.js'
import User, { Provider } from '#models/user'

import ForgotPassword from '#views/pages/auth/forgot_password'

export default class LocalForgotPasswordController {
  async index() {
    return <ForgotPassword />
  }

  @inject()
  async getResetToken({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const { email } = await request.validateUsing(getResetTokenValidator)

    // check if user exists
    const user = await User.query()
      .where((query) => {
        query.where('email', email).where('provider', Provider.LOCAL)
      })
      .first()

    if (!user) {
      return response.noContent()
    }

    await localAuthService.sendResetPasswordEmail(request.host()!, user)

    // flash message
    response.ok({
      message: `Reset password e-mail sent to: ${user.email}.`,
    })

    return response.redirect().back()
  }
}
