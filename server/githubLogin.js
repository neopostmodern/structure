import session from 'express-session';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github';
import ConnectMongoDbSession from 'connect-mongodb-session';
const MongoDBSession = ConnectMongoDbSession(session);

import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_LOGIN_CALLBACK,
  SESSION_SECRET,
} from './githubKeys';

const store = new MongoDBSession({
  uri: 'mongodb://localhost:27017/structureApp',
  collection: 'sessions'
});

export function setUpGitHubLogin(app, User) {
  if (!GITHUB_CLIENT_ID) {
    console.warn('GitHub client ID not passed; login won\'t work.'); // eslint-disable-line no-console
    return;
  }
  
  const gitHubStrategyOptions = {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: GITHUB_LOGIN_CALLBACK
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
          })
        }
      });
    }));
  
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((obj, cb) => cb(null, obj));
  
  app.use(session({
    secret: SESSION_SECRET,
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
      res.redirect('/success');
    }
  );
  
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/success')
  });
}

