/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The pages file is used for defining the HTTP pages.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const SettingsController = () => import('../app/settings/settings_controller.js')

const LocalSignUpController = () => import('../app/auth/controllers/local_sign_up_controller.js')
const LocalSignInController = () => import('../app/auth/controllers/local_sign_in_controller.js')
const LocalValidationController = () =>
  import('../app/auth/controllers/local_validation_controller.js')
const LocalForgotPasswordController = () =>
  import('../app/auth/controllers/local_forgot_password_controller.js')
const LocalResetPasswordController = () =>
  import('../app/auth/controllers/local_reset_password_controller.js')
const GoogleAuthController = () => import('../app/auth/controllers/google_auth_controller.js')
const CommonAuthController = () => import('../app/auth/controllers/common_auth_controller.js')

const HomeController = () => import('../app/home/controllers/home_controller.js')
const AlbumController = () => import('../app/album/controllers/album_controller.js')

router
  .group(() => {
    router.get('/sign-up', [LocalSignUpController, 'index'])
    router.post('/sign-up/local', [LocalSignUpController, 'store']).as('auth.sign-up')

    router.get('/sign-in', [LocalSignInController, 'index'])
    router.post('/sign-in/local', [LocalSignInController, 'store']).as('auth.sign-in')

    router.get('/validate', [LocalValidationController, 'execute'])

    router.get('/forgot-password', [LocalForgotPasswordController, 'index'])
    router
      .post('/forgot-password', [LocalForgotPasswordController, 'getResetToken'])
      .as('auth.forgot-password')

    router.get('/reset-password', [LocalResetPasswordController, 'index'])
    router
      .post('/reset-password', [LocalResetPasswordController, 'resetPassword'])
      .as('auth.reset-password')

    router.get('/login/google', [GoogleAuthController, 'loginGoogle'])
    router.get('/login/google/callback', [GoogleAuthController, 'loginGoogleCallback'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.get('/', [HomeController, 'index']).as('home')
    router.get('/album/:id', [AlbumController, 'index']).as('album')
    router.get('/settings', [SettingsController, 'index']).as('settings')

    router.post('/logout', [CommonAuthController, 'logout']).as('auth.logout')
  })
  .use(middleware.auth())

router
  .group(() => {})
  .prefix('/api/media')
  .use(middleware.auth())
