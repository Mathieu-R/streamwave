import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import LocalAuthService from '../services/local_auth_service.js'
import { tokenValidator } from '../validators/local_auth.js'
import User, { Provider } from '#models/user'
import { DateTime } from 'luxon'
import AuthError from '#views/pages/errors/auth_error'

export default class LocalValidationController {
  @inject()
  async execute({ request, response }: HttpContext, localAuthService: LocalAuthService) {
    console.log('DEBUG')
    const qs = request.qs()
    const { token } = await tokenValidator.validate(qs)

    // check if token is still valid
    const user = await User.query()
      .where((query) => {
        return query
          .where('provider', Provider.LOCAL)
          .andWhere('emailVerificationToken', token)
          .andWhere('emailVerificationTokenExpiredAt', '>', DateTime.now().toSQLDate())
      })
      .first()

    // token does not exist or is expired
    if (!user) {
      const message = 'This account verification token does not exist or is expired.'
      return <AuthError message={message} />
    }

    await localAuthService.validateAccount(user)

    return response.redirect().toPath('/sign-in')
  }
}
