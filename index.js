const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('./database/knex');

const app = express();
app.use(cors());
app.use(bodyParser.json());

async function createTables() {
    const hasUsers = await knex.schema.hasTable('users');
    if (!hasUsers) {
        await knex.schema.createTable('users', table => {
            table.increments('id').primary();
            table.string('firstname').notNullable();
            table.string('lastname').notNullable();
            table.string('email').notNullable().unique();
            table.integer('age').notNullable();
            table.string('role').notNullable().defaultTo('user');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
    }

    const hasPosts = await knex.schema.hasTable('posts');
    if (!hasPosts) {
        await knex.schema.createTable('posts', table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content').notNullable();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
    }
}

createTables()
    .then(() => {
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

        const userRoutes = require('./routes/userRoutes');
        const postRoutes = require('./routes/postRoutes');
        app.use('/users', userRoutes);
        app.use('/posts', postRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('Error creating tables:', err);
        process.exit(1);
    });

