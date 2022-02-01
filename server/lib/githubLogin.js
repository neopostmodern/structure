import config from '@structure/config'
import ConnectMongoDbSession from 'connect-mongodb-session'
import session from 'express-session'
import passport from 'passport'
import PassportGithub from 'passport-github'

// named import isn't working at the moment
const GitHubStrategy = PassportGithub.Strategy

const MongoDBSession = ConnectMongoDbSession(session)

const store = new MongoDBSession({
  uri: config.MONGO_URL,
  collection: 'sessions',
})

export function setUpGitHubLogin(app, User) {
  if (!config.GITHUB_CLIENT_ID) {
    console.warn("GitHub client ID not passed; login won't work.") // eslint-disable-line no-console
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
        User.findOne({ _id: profile.id }).then((user) => {
          if (user) {
            cb(null, user)
          } else {
            new User({
              _id: profile.id,
              name: profile.username,
              createAt: new Date(),
              authenticationProvider: profile.provider,
            })
              .save()
              .then((newUser) => {
                cb(null, newUser)
              })
          }
        })
      },
    ),
  )

  // todo: monitor if this is too resource heavy (it helps avoiding caching issues)
  passport.serializeUser((user, cb) => cb(null, user._id))
  passport.deserializeUser((userId, cb) =>
    User.findOne({ _id: userId }).then((user) => cb(null, user)),
  )

  app.use(
    session({
      secret: config.SESSION_SECRET,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
      rolling: true,
      resave: true,
      saveUninitialized: false,
      secure: process.env.NODE_ENV !== 'development',
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

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect(config.WEB_FRONTEND_HOST)
  })
}
