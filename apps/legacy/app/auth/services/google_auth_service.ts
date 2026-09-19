import User, { Provider } from '#models/user'

export class GoogleAuthService {
  storeUser(user: any) {
    return User.updateOrCreate(
      {
        email: user.email,
        provider: Provider.GOOGLE,
      },
      {
        firstname: user.original.given_name,
        lastname: user.original.family_name,
        password: user.id,
        avatarUrl: user.avatarUrl,
        emailVerified: true,
      }
    )
  }
}
