import GuestLayout from '#views/layouts/guest'
import FormInput from '#views/components/form/input'
import { csrfField, getFlashMessages, route } from '#start/view'

export default function SignIn() {
  const flashMessages = getFlashMessages()
  console.log(flashMessages.all())
  console.log()
  return (
    <GuestLayout>
      <div class={'container--center'}>
        <div class={'sign-in-wrapper'}>
          <h1 class={'form__title'}>Welcome back !</h1>
          <form class={'form'} method={'POST'} action={route('auth.sign-in')}>
            {csrfField()}

            <FormInput
              label={'Email'}
              name={'email'}
              type={'email'}
              iconUrl={'resources/assets/svg/mail.svg'}
              error={flashMessages.get('errors.email')}
            />

            <FormInput
              label={'Password'}
              type={'password'}
              name={'password'}
              iconUrl={'resources/assets/svg/lock.svg'}
              error={flashMessages.get('errors.password')}
            />

            <button class={'btn btn--primary'} type="submit">
              Login
            </button>
          </form>

          <a class={'forgot-password-link'} href={'/forgot-password'}>
            I forgot my password
          </a>

          <p class={'or-divider'}>OR</p>

          <button class={'btn btn--secondary'}>
            <a class={'social-auth-link social-auth-link--google'} href={'/sign-in/google'}>
              Continue with Google
            </a>
          </button>
          <button class={'btn btn--secondary'}>
            <a class={'social-auth-link social-auth-link--github'} href={'sign-in/github'}>
              Continue with Github
            </a>
          </button>

          <p class={'no-account-link'}>
            Don't have an account ? <a href={'/sign-up'}>Register here</a>
          </p>
        </div>
      </div>
    </GuestLayout>
  )
}
