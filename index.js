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
    <li>GET /stats</li>
  </ul>

  <p><a href="/">← Back</a></p>
</body>
</html>
            `);
        });

        // ✅ API Tester
        app.get('/tester', (req, res) => {
            res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>API Tester</title>
  <style>
    body { font-family: Arial; padding: 40px; }
    button { margin: 5px; padding: 10px; }
    pre { background: #eee; padding: 20px; margin-top: 20px; max-height: 400px; overflow: auto; }
    h2 { margin-top: 30px; }
  </style>
</head>
<body>

<h1>BeautyConnect API Tester</h1>

<h2>Seed demo data</h2>
<button onclick="seedUsers()">Add demo users</button>
<button onclick="seedPosts()">Add demo posts</button>

<h2>View data</h2>
<button onclick="fetchApi('/users')">View users</button>
<button onclick="fetchApi('/posts')">View posts</button>
<button onclick="fetchApi('/categories')">View categories</button>

<h2>Sorting</h2>
<button onclick="fetchApi('/users?sort=age&order=desc')">Users by age (desc)</button>
<button onclick="fetchApi('/posts?sort=created_at&order=desc')">Posts newest first</button>

<h2>Stats</h2>
<button onclick="fetchApi('/stats')">View stats</button>

<h2>Validation test</h2>
<button onclick="testValidation()">Trigger validation error</button>

<pre id="output">Click a button to test the API</pre>

<p><a href="/">← Back</a></p>

<script>
function fetchApi(endpoint) {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
    });
}

// 🔁 VERVANGEN seedUsers()
function seedUsers() {
  const timestamp = Date.now();

  const users = [
    {
      firstname: 'Demo',
      lastname: 'Admin',
      email: \`admin_\${timestamp}@demo.com\`,
      age: 30,
      role: 'admin'
    },
    {
      firstname: 'Demo',
      lastname: 'User',
      email: \`user_\${timestamp}@demo.com\`,
      age: 24,
      role: 'user'
    },
    {
      firstname: 'Beauty',
      lastname: 'Tester',
      email: \`tester_\${timestamp}@demo.com\`,
      age: 19,
      role: 'user'
    }
  ];

  Promise.all(
    users.map(u =>
      fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(u)
      }).then(res => res.json())
    )
  ).then(results => {
    document.getElementById('output').textContent =
      JSON.stringify(results, null, 2);
  });
}

function seedPosts() {
  const posts = [
    { title: 'Makeup tips', content: 'Basic makeup tips for beginners', user_id: 1 },
    { title: 'Skincare routine', content: 'Daily skincare routine explained', user_id: 1 }
  ];

  posts.forEach(p => {
    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
  });

  document.getElementById('output').textContent = 'Demo posts added';
}

function testValidation() {
  fetch('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'makeup123' })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('output').textContent =
      JSON.stringify(data, null, 2);
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

        // ✅ Stats route
        app.get('/stats', async (req, res) => {
            try {
                const usersRow = await knex('users').count({ count: '*' }).first();
                const postsRow = await knex('posts').count({ count: '*' }).first();

                let categoriesCount = 0;
                const hasCategories = await knex.schema.hasTable('categories');
                if (hasCategories) {
                    const categoriesRow = await knex('categories').count({ count: '*' }).first();
                    categoriesCount = Number(categoriesRow.count || 0);
                }

                res.json({
                    users: Number(usersRow.count || 0),
                    posts: Number(postsRow.count || 0),
                    categories: categoriesCount
                });
            } catch (e) {
                res.status(500).json({ error: 'Failed to load stats', details: e.message });
            }
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () =>
            console.log(`Server running on http://localhost:${PORT}`)
        );
    })
    .catch(err => {
        console.error('Error creating tables:', err);
        process.exit(1);
    });
