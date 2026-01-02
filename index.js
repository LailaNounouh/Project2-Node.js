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
        console.log("Users table created!");
    }

    const hasCategories = await knex.schema.hasTable('categories');
    if (!hasCategories) {
        await knex.schema.createTable('categories', table => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description');
        });
        console.log("Categories table created!");
    }

    const hasPosts = await knex.schema.hasTable('posts');
    if (!hasPosts) {
        await knex.schema.createTable('posts', table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content').notNullable();
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE');
            table
                .integer('category_id')
                .unsigned()
                .references('id')
                .inTable('categories')
                .onDelete('SET NULL');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
        console.log("Posts table created!");
    }
}

createTables()
    .then(() => {

        // ✅ STAP 1 — Startpagina met 2 knoppen (/)
        app.get('/', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>BeautyConnect API</title>
                    <style>
                        body {
                            font-family: Arial;
                            background: #f5f5f5;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                        }
                        .box {
                            background: white;
                            padding: 40px;
                            border-radius: 8px;
                            text-align: center;
                            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                        }
                        button {
                            padding: 12px 20px;
                            margin: 10px;
                            font-size: 16px;
                            cursor: pointer;
                        }
                    </style>
                </head>
                <body>
                    <div class="box">
                        <h1>BeautyConnect API</h1>
                        <p>Select an option</p>
                        <button onclick="location.href='/docs'">API Documentation</button>
                        <button onclick="location.href='/tester'">API Tester</button>
                    </div>
                </body>
                </html>
            `);
        });

        // 🟢 STAP 2 — API documentatie pagina (/docs)
        app.get('/docs', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>API Documentation</title>
                    <style>
                        body { font-family: Arial; padding: 40px; }
                        h2 { margin-top: 30px; }
                    </style>
                </head>
                <body>
                    <h1>BeautyConnect API – Documentation</h1>

                    <h2>Users</h2>
                    <ul>
                        <li>GET /users</li>
                        <li>GET /users/:id</li>
                        <li>POST /users</li>
                        <li>PUT /users/:id</li>
                        <li>DELETE /users/:id</li>
                    </ul>

                    <h2>Posts</h2>
                    <ul>
                        <li>GET /posts</li>
                        <li>GET /posts/:id</li>
                        <li>POST /posts</li>
                        <li>PUT /posts/:id</li>
                        <li>DELETE /posts/:id</li>
                    </ul>

                    <h2>Categories</h2>
                    <ul>
                        <li>GET /categories</li>
                        <li>GET /categories/:id</li>
                        <li>POST /categories</li>
                        <li>PUT /categories/:id</li>
                        <li>DELETE /categories/:id</li>
                    </ul>

                    <p><a href="/">← Back</a></p>
                </body>
                </html>
            `);
        });

        // 🔥 STAP 3 — API Tester pagina (/tester)
        app.get('/tester', (req, res) => {
            res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>API Tester</title>
                    <style>
                        body { font-family: Arial; padding: 40px; }
                        button { margin: 5px; padding: 10px; }
                        pre {
                            background: #eee;
                            padding: 20px;
                            margin-top: 20px;
                            max-height: 400px;
                            overflow: auto;
                        }
                    </style>
                </head>
                <body>
                    <h1>API Tester</h1>

                    <button onclick="testApi('/users')">Test Users</button>
                    <button onclick="testApi('/posts')">Test Posts</button>
                    <button onclick="testApi('/categories')">Test Categories</button>

                    <pre id="output">Click a button to test the API</pre>

                    <p><a href="/">← Back</a></p>

                    <script>
                        function testApi(endpoint) {
                            fetch(endpoint)
                                .then(res => res.json())
                                .then(data => {
                                    document.getElementById('output').textContent =
                                        JSON.stringify(data, null, 2);
                                })
                                .catch(err => {
                                    document.getElementById('output').textContent = err;
                                });
                        }
                    </script>
                </body>
                </html>
            `);
        });

        // ✅ Routes
        const userRoutes = require('./routes/userRoutes');
        const postRoutes = require('./routes/postRoutes');
        const categoryRoutes = require('./routes/categoryRoutes');

        app.use('/users', userRoutes);
        app.use('/posts', postRoutes);
        app.use('/categories', categoryRoutes);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('Error creating tables:', err);
        process.exit(1);
    });
