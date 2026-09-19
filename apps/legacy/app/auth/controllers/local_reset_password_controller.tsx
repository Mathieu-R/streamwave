import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LocalAuthService from '../services/local_auth_service.js'
import { resetPasswordValidator, tokenValidator } from '../validators/local_auth.js'

import ResetPassword from '#views/pages/auth/reset_password'

export default class LocalResetController {
  index() {
    return <ResetPassword />
  }

  @inject()
  async checkResetToken({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const qs = request.qs()
    const { token } = await tokenValidator.validate(qs)

    // check if token is still valid
    const user = await localAuthService.checkResetToken(token)

    // token does not exist or is expired
    if (!user) {
      return response.unauthorized('This password reset token does not exist or is expired.')
    }

    return response.redirect('/auth/reset/${token}')
  }

  @inject()
  async resetPassword({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    const { token } = await tokenValidator.validate(request.qs())
    const { password } = await request.validateUsing(resetPasswordValidator)

    // check if token is still valid
    const user = await localAuthService.checkResetToken(token)

    if (!user) {
      return response.unauthorized('This password reset token does not exist or is expired.')
    }

    // hashing is performed by the AuthFinder mixin
    // https://docs.adonisjs.com/guides/authentication/verifying-user-credentials#hashing-user-password
    user.password = password
    user.resetPasswordToken = null
    user.resetPasswordTokenExpiredAt = null
    await user.save()

    response.ok({ message: 'Password successfully changed !' })
  }
}
