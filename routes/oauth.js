'use strict';

const express = require('express');
const router = express.Router();

const knex = require('../knex.js');
const boom = require('boom');
const { camelizeKeys, decamelizeKeys } = require('humps');

const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;

const jwt = require('jsonwebtoken');

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
  scope: [ 'user:email' ],
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken, refreshToken });
}));

router.get('/github',
  passport.authenticate('github', {
    session: false,
  }), (req, res) => { console.log('hello world'); });

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/signin'}), (req, res, next) => {
  const user = req.user;
  const name = JSON.parse(user.profile._raw).name;
  const email = user.profile.emails[0].value;
  const photoUrl = JSON.parse(user.profile._raw).avatar_url;
  const githubId = user.profile.id;
  const githubToken = user.accessToken;

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .then((result) => {
      if (result.length < 1) {
        const newUser = {
          name,
          email,
          photoUrl,
          githubId,
          githubToken
        }

        knex('users').insert(decamelizeKeys(newUser), '*')
          .then(user => {
            return user;
          }).catch((err) => {
            next(err);
          });
      }
    })
    .then((user) => {
      knex('users')
        .where('email', email)
        .then((row) => {
          const userId = row[0].id;
          const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3);
          const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, { expiresIn: '3h' });

          res.cookie('token', token, {
            httpOnly: true,
            expires: expiry,
            secure: router.get('env') === 'production',
          });

          res.redirect('/');
        })
        .catch((err) => {
          return err;
        })
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;