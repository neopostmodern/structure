import config from '@structure/config' with { type: 'json' }
import ConnectMongoDbSession from 'connect-mongodb-session'
import session from 'express-session'
import passport from 'passport'
import PassportGithub from 'passport-github'
import { logger } from '../util/logging.mts'
import { createOwnershipTagOnUser } from './methods/createOwnershipTagOnUser.mts'
import { User } from './userModel.mts'

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

          const newUserWithOwnershipTagId = await createOwnershipTagOnUser(
            newUser,
          )
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

  app.get(
    '/login/github/callback',
    passport.authenticate('github', { failureRedirect: '/failure' }),
    (req, res) => {
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
