import config from '@structure/config'
import ConnectMongoDbSession from 'connect-mongodb-session'
import session from 'express-session'
import passport from 'passport'
import PassportGithub from 'passport-github2'
import { logger } from '../util/logging.mts'
import { issueToken } from './tokensMethods.mts'
import { createOwnershipTagOnUser } from './methods/createOwnershipTagOnUser.mts'
import { User } from './userModel.mts'

// The browser-extension login flow can't rely on a shared session cookie (its
// OAuth popup runs in an isolated, ephemeral cookie jar by browser design), so
// instead of ending in a Set-Cookie it ends by redirecting to a redirect_uri
// the extension itself provided, with a bearer token in the URL fragment. To
// stop that redirect_uri from being abused as an open redirect / token leak,
// only exact, admin-configured values are ever allowed.
const isAllowedExtensionRedirectUri = (uri: unknown): uri is string =>
  typeof uri === 'string' &&
  (config.EXTENSION_LOGIN_REDIRECT_URIS || []).includes(uri)

// named import isn't working at the moment
const GitHubStrategy = PassportGithub.Strategy

const MongoDBSession = ConnectMongoDbSession(session)

const store = new MongoDBSession({
  uri: config.MONGO_URL,
  collection: 'sessions',
})

export function setUpGitHubLogin(app) {
  if (!config.GITHUB_CLIENT_ID) {
    logger.error("GitHub client ID not passed; login won't work.")
    return
  }

  const gitHubStrategyOptions = {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.BACKEND_URL}/login/github/callback`,
  }

  passport.use(
    new GitHubStrategy(
      gitHubStrategyOptions,
      (accessToken, refreshToken, profile, cb) => {
        ;(async () => {
          const user = await User.findById(profile.id).lean()
          if (user) {
            cb(null, user)
            return
          }

          const newUser = await new User({
            _id: profile.id,
            name: profile.username,
            createAt: new Date(),
            authenticationProvider: profile.provider,
            internal: {
              ownershipTagId: '',
            },
          }).save()

          const newUserWithOwnershipTagId =
            await createOwnershipTagOnUser(newUser)
          cb(null, newUserWithOwnershipTagId)
        })()
      },
    ),
  )

  passport.serializeUser((user, cb) => cb(null, user._id))
  passport.deserializeUser((userId, cb) => {
    User.findById(userId)
      .lean()
      .then((user) => {
        cb(null, user)
      })
  })

  app.use(
    session({
      secret: config.SESSION_SECRET,
      proxy: process.env.NODE_ENV !== 'development',
      cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'none',
      },
      rolling: true,
      resave: true,
      saveUninitialized: false,
      store,
    }),
  )

  app.use(passport.initialize())
  app.use(passport.session())

  app.get('/login/github', passport.authenticate('github'))

  // Entry point for the browser extension: it passes the redirect_uri its
  // own browser.identity.launchWebAuthFlow() call will be listening for, and
  // we thread it through as the OAuth `state` param so the callback below can
  // recognize this login as extension-initiated and hand back a token
  // instead of (only) a session cookie.
  app.get('/login/github/extension', (request, result, next) => {
    const { redirect_uri: redirectUri } = request.query
    if (!isAllowedExtensionRedirectUri(redirectUri)) {
      result
        .status(400)
        .send(
          `Invalid or unregistered redirect_uri for extension login: ${redirectUri}`,
        )
      return
    }

    passport.authenticate('github', { state: redirectUri })(
      request,
      result,
      next,
    )
  })

  app.get(
    '/login/github/callback',
    passport.authenticate('github', { failureRedirect: '/failure' }),
    (req, res) => {
      const { state } = req.query
      if (isAllowedExtensionRedirectUri(state)) {
        issueToken((req.user as any)._id, 'extension')
          .then((token) => {
            res.redirect(`${state}#token=${token}`)
          })
          .catch((error) => {
            logger.error('Failed to mint extension login token', error)
            res.status(500).send('Failed to complete extension login.')
          })
        return
      }

      res.send(`
<!doctype html>
<html lang="en">
<body>
<h1>You're logged in!</h1>
<main>This window should close itself.</main>
<script>
    window.close();
</script>
</body>
</html>
`)
    },
  )

  app.get('/logout', (request, result) => {
    request.logout(() => {
      result.redirect(config.WEB_FRONTEND_HOST)
    })
  })
}
