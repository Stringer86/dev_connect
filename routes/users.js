/* eslint-disable max-len camelcase */
'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');
const ev = require('express-validation');
const validations = require('../validations/users');

// eslint-disable-next-line new-cap
const router = express.Router();

const authorize = function(req, res, next) {
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
};

router.post('/api/user', ev(validations.post), (req, res, next) => {
  const { name, email, password, bio } = req.body;

  knex('users')
    .select(knex.raw('1=1'))
    .where('email', email)
    .first()
    .then((exists) => {
      if (exists) {
        throw boom.create(400, 'Email already exists');
      }

      return bcrypt.hash(password, 12);

    })
    .then((hashedPassword) => {

      const insertUser = { name, email, bio, hashedPassword };

      return knex('users')
        .insert(decamelizeKeys(insertUser), '*');
    })
    .then((row) => {
      res.send('success');
    })
    .catch((err) => {
      next(err);
    });
});



router.get('/api/user', authorize, (req, res, next) => {
  const { userId } = req.token;

  knex('users')
    .innerJoin('lessons', 'users.id', 'lessons.user_id')
    .where('lessons.user_id', userId)
    .orderBy('lessons.updated_at', 'ASC')  // check to make sure it's ordering properly
    .then((rows) => {
      const userInfo = camelizeKeys(rows);

      res.send(userInfo);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/api/user/:id', (req, res, next) => {
  const userId  = Number.parseInt(req.params.id);

  knex('users')
    .innerJoin('lessons', 'users.id', 'lessons.user_id')
    .where('lessons.user_id', userId)
    .orderBy('lessons.updated_at', 'ASC')  // check to make sure it's ordering properly
    .then((rows) => {
      const userInfo = camelizeKeys(rows);

      res.send(userInfo);
    })
    .catch((err) => {
      next(err);
    });
});



router.get('/api/userData', authorize, (req, res, next) => {
  const { userId } = req.token;
  knex('users')
    .where('id', userId)
    .then((rows) => {
      const userData = camelizeKeys(rows);

      res.send(userData);
    })
    .catch((err) => {
      next(err);
    });
});

router.get('/api/userData/:id', (req, res, next) => {
  const userId  = Number.parseInt(req.params.id);
  knex('users')
    .where('id', userId)
    .then((rows) => {
      const userData = camelizeKeys(rows);

      delete userData[0].hashedPassword;
      delete userData[0].email;
      delete userData[0].githubId;
      delete userData[0].githubToken;

      res.send(userData);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/api/user', authorize, (req, res, next) => {
  const { userId } = req.token;

  const { firstName, lastName, photoUrl, bio } = req.body;

  knex('users')
    .where('id', userId)
    .update({
      first_name: firstName,
      last_name: lastName,
      photo_url: photoUrl,
      bio: bio
    })
    .then((row) => {
      res.send('success');
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
