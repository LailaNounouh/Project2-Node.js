
const path = require('path');
const knexLib = require('knex');


const dbFilePath = path.join(__dirname, 'database.sqlite3');

const knex = knexLib({
    client: 'sqlite3',
    connection: {
        filename: dbFilePath,
    },
    useNullAsDefault: true,
    pool: {
        afterCreate: (conn, done) => {

            conn.run('PRAGMA foreign_keys = ON', done);
        },
    },
});

module.exports = knex;
