/* eslint-disable camelcase, max-len */
'use strict';

exports.seed = function(knex) {
  return knex('favorites').del()
    .then(() => {
      return knex('favorites')
      .insert(
        [{
          id: 1,
          lesson_id: 1,
          user_id: 1,
          created_at: new Date('2016-06-29 14:26:16 UTC'),
          updated_at: new Date('2016-06-29 14:26:16 UTC')
        }, {
          id: 2,
          lesson_id: 2,
          user_id: 2,
          created_at: new Date('2016-06-29 14:26:16 UTC'),
          updated_at: new Date('2016-06-29 14:26:16 UTC')
        }]
      );
    })
    .then(() => {
      return knex.raw("SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));"
      );
    });
};
