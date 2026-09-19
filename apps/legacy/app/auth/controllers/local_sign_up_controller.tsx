import type { HttpContext } from '@adonisjs/core/http'
import User, { Provider } from '#models/user'
import { registerValidator } from '../validators/local_auth.js'
import { inject } from '@adonisjs/core'
import LocalAuthService from '../services/local_auth_service.js'

import SignUp from '#views/pages/auth/sign_up'

export default class LocalAuthController {
  async index() {
    return <SignUp />
  }

  @inject()
  async store({ request, session, response }: HttpContext, localAuthService: LocalAuthService) {
    // validate the request
    const { firstname, lastname, email, password } = await request.validateUsing(registerValidator)

    // check user does not already exist
    const existingUser = await User.query()
      .where((query) => {
        query.where('email', email).andWhere('provider', Provider.LOCAL)
      })
      .first()

    if (existingUser) {
      session.flash('errors', { email: 'User already exists' })
    }

    // create the user (hash is handled by the model)
    const user = await localAuthService.createUser({ firstname, lastname, email, password })

    // send email verification
    await localAuthService.sendVerificationEmail(request.host()!, user)

    // flash message
    session.flash({
      message: ['User created successfully', 'Verify your email to activate your account'],
    })

    return response.redirect().back()
  }
}
