const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('./db/knex'); // koppel Knex

const app = express();
app.use(cors());
app.use(bodyParser.json());


// TABELLEN AANMAKEN

async function createTables() {
    // Users tabel
    await knex.schema.hasTable('users').then(async (exists) => {
        if (!exists) {
            await knex.schema.createTable('users', table => {
                table.increments('id').primary();
                table.string('first_name').notNullable();
                table.string('last_name').notNullable();
                table.string('email').notNullable().unique();
                table.integer('age').notNullable();
            });
            console.log("Users table created!");
        }
    });

    // Posts tabel
    await knex.schema.hasTable('posts').then(async (exists) => {
        if (!exists) {
            await knex.schema.createTable('posts', table => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.text('content').notNullable();
                table.integer('user_id').unsigned().references('id').inTable('users');
                table.timestamp('created_at').defaultTo(knex.fn.now());
            });
            console.log("Posts table created!");
        }
    });
}


createTables();

// ROOT ENDPOINT

app.get('/', (req, res) => {
    res.send(`
    <h1>BeautyConnect API</h1>
    <ul>
      <li>GET /users</li>
      <li>POST /users</li>
      <li>GET /users/:id</li>
      <li>PUT /users/:id</li>
      <li>DELETE /users/:id</li>
      <li>GET /posts</li>
      <li>POST /posts</li>
      <li>GET /posts/:id</li>
      <li>PUT /posts/:id</li>
      <li>DELETE /posts/:id</li>
    </ul>
  `);
});


// SERVER STARTEN

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
