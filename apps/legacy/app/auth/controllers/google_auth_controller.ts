// import type { HttpContext } from '@adonisjs/core/http'

import { HttpContext } from '@adonisjs/core/http'
import { GoogleAuthService } from '../services/google_auth_service.js'
import { inject } from '@adonisjs/core'

export default class GoogleAuthController {
  async loginGoogle({ ally }: HttpContext) {
    const google = ally.use('google')
    return google.redirect()
  }

  @inject()
  async loginGoogleCallback(
    { response, ally, auth }: HttpContext,
    googleAuthService: GoogleAuthService
  ) {
    const google = ally.use('google')
    const profile = await google.user()
    console.log(profile.original)

    const user = await googleAuthService.storeUser(profile)
    auth.use('web').login(user)

    return response.redirect('/')
  }
}
