import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import ConnectMongoDbSession from 'connect-mongodb-session';

import config from './config';

const MongoDBSession = ConnectMongoDbSession(session);

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/structureApp',
  collection: 'sessions'
});

export function setUpGitHubLogin(app, User) {
  if (!config.GITHUB_CLIENT_ID) {
    console.warn('GitHub client ID not passed; login won\'t work.'); // eslint-disable-line no-console
    return;
  }

  const gitHubStrategyOptions = {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.GITHUB_LOGIN_CALLBACK
  };

  passport.use(new GitHubStrategy(gitHubStrategyOptions,
    (accessToken, refreshToken, profile, cb) => {
      // console.log(profile);
      User.findOne({ _id: profile.id }).then((user) => {
        if (user) {
          cb(null, user);
        } else {
          new User({
            _id: profile.id,
            name: profile.username,
            createAt: new Date(),
            authenticationProvider: profile.provider
          }).save().then((newUser) => {
            cb(null, newUser);
          });
        }
      });
    }));

  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));

  app.use(session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login/github',
    passport.authenticate('github'));

  app.get('/login/github/callback',
    passport.authenticate('github', { failureRedirect: '/failure' }),
    (req, res) => {
      res.redirect(`${config.FRONTEND_HOST}`);
    }
  );

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect(`${config.FRONTEND_HOST}`);
  });
}

