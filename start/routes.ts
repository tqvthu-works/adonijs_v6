/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import router from '@adonisjs/core/services/router'
import User from '#models/user'
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware'),
})
// declare route post /login
router.post('login', async ({ request, auth, response }) => {
  const { email, password } = request.only(['email', 'password'])
  const user = await User.verifyCredentials(email, password)
  await auth.use('web').login(user)
  return response.redirect('/dashboard')
})
router
  .get('dashboard', () => {
    return {
      message: 'Dashboard',
    }
  })
  .use(middleware.auth())

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router.post('users/:id/tokens', async ({ params }) => {
  const user = await User.findOrFail(params.id)
  const token = await User.accessTokens.create(user)

  return {
    type: 'bearer',
    value: token.value!.release(),
  }
})
router.post('projects', async ({ auth, response }) => {
  // Authenticate using the default guard
  const user = await auth.authenticateUsing(['api'])
  // const user = await auth.authenticate()
  return response.send({ message: 'Project created', user: user })
})

// use with middleware
// router.post('projects', async ({ response }) => {
//   return response.send({ message: 'Project created' })
// }).use(middleware.auth({guards: ['api']}))

router.get('test-jwt-guard', async ({ response }) => {
  return response.send({ message: 'jwt guard' })
}).use(middleware.auth({ guards: ['jwt'] }));
