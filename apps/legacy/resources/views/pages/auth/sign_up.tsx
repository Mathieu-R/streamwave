import { route, csrfField, getFlashMessages } from '#start/view'

import GuestLayout from '#views/layouts/guest'
import FormInput from '#views/components/form/input'

export default function SignUp() {
  const flashMessages = getFlashMessages()

  return (
    <GuestLayout>
      <div class={'container--center'}>
        <div class="sign-up-wrapper">
          <h1>Sign Up</h1>
          <form class={'form'} method={'POST'} action={route('auth.sign-up')}>
            {csrfField()}

            <FormInput
              label={'Firstname'}
              name={'firstname'}
              type={'text'}
              iconUrl={'resources/assets/svg/user.svg'}
              error={flashMessages.get('errors.firstname')}
            />

            <FormInput
              label={'Lastname'}
              name={'lastname'}
              type={'text'}
              iconUrl={'resources/assets/svg/user.svg'}
              error={flashMessages.get('errors.lastname')}
            />

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

            <FormInput
              label={'Password confirmation'}
              type={'password'}
              name={'password_confirmation'}
              iconUrl={'resources/assets/svg/lock.svg'}
              error={flashMessages.get('errors.password_confirmation')}
            />

            <button class={'btn btn--primary'} type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </GuestLayout>
  )
}
