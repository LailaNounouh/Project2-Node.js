const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: './database/database.sqlite3' // pad naar je database
  },
  useNullAsDefault: true
});

module.exports = knex;
