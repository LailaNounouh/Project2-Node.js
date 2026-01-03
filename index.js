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

    const hasCategories = await knex.schema.hasTable('categories');
    if (!hasCategories) {
        await knex.schema.createTable('categories', table => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description');
        });
    }

    const hasPosts = await knex.schema.hasTable('posts');
    if (!hasPosts) {
        await knex.schema.createTable('posts', table => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content').notNullable();
            table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
            table.timestamp('created_at').defaultTo(knex.fn.now());
        });
    }
}

createTables().then(() => {

    app.get('/tester', (req, res) => {
        res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>API Tester</title>

  <!-- ✅ VERVANGEN STYLE -->
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f4f6fb;
      padding: 40px;
    }

    h1 {
      text-align: center;
      margin-bottom: 40px;
    }

    .section {
      background: white;
      padding: 20px;
      margin-bottom: 25px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }

    h2 {
      margin-top: 0;
    }

    button {
      padding: 10px 14px;
      margin: 5px 5px 5px 0;
      border: none;
      border-radius: 5px;
      background: #6c63ff;
      color: white;
      cursor: pointer;
    }

    button:hover {
      background: #574fe0;
    }

    pre {
      background: #111;
      color: #0f0;
      padding: 20px;
      border-radius: 6px;
      max-height: 350px;
      overflow: auto;
    }

    a {
      display: inline-block;
      margin-top: 20px;
      text-decoration: none;
      color: #6c63ff;
    }
  </style>
</head>

<body>

<h1>BeautyConnect API Tester</h1>

<div class="section">
  <h2>Seed demo data</h2>
  <button onclick="seedUsers()">Add demo users</button>
  <button onclick="seedPosts()">Add demo posts</button>
</div>

<div class="section">
  <h2>View data</h2>
  <button onclick="fetchApi('/users')">View users</button>
  <button onclick="fetchApi('/posts')">View posts</button>
  <button onclick="fetchApi('/categories')">View categories</button>
</div>

<div class="section">
  <h2>Sorting</h2>
  <button onclick="fetchApi('/users?sort=age&order=asc')">Age asc</button>
  <button onclick="fetchApi('/users?sort=age&order=desc')">Age desc</button>
</div>

<div class="section">
  <h2>Stats</h2>
  <button onclick="fetchApi('/stats')">View stats</button>
</div>

<div class="section">
  <h2>Validation test</h2>
  <button onclick="testValidation()">Trigger validation error</button>
</div>

<pre id="output">Click a button to test the API</pre>

<a href="/">← Back</a>

<script>
function fetchApi(endpoint) {
  fetch(endpoint)
    .then(res => res.json())
    .then(data => {
      document.getElementById('output').textContent =
        JSON.stringify(data, null, 2);
    });
}

function seedUsers() {
  const timestamp = Date.now();
  const users = [
    { firstname: 'Demo', lastname: 'Admin', email: \`admin_\${timestamp}@demo.com\`, age: 30, role: 'admin' },
    { firstname: 'Demo', lastname: 'User', email: \`user_\${timestamp}@demo.com\`, age: 24, role: 'user' },
    { firstname: 'Beauty', lastname: 'Tester', email: \`tester_\${timestamp}@demo.com\`, age: 19, role: 'user' }
  ];

  Promise.all(users.map(u =>
    fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u)
    }).then(r => r.json())
  )).then(r =>
    document.getElementById('output').textContent = JSON.stringify(r, null, 2)
  );
}

function seedPosts() {
  const posts = [
    { title: 'Makeup tips', content: 'Basic makeup tips for beginners', user_id: 1 },
    { title: 'Skincare routine', content: 'Daily skincare routine explained', user_id: 1 }
  ];

  posts.forEach(p =>
    fetch('/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    })
  );

  document.getElementById('output').textContent = 'Demo posts added';
}

function testValidation() {
  fetch('/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'makeup123' })
  })
  .then(r => r.json())
  .then(d =>
    document.getElementById('output').textContent = JSON.stringify(d, null, 2)
  );
}
</script>

</body>
</html>
        `);
    });

    const PORT = 3000;
    app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
});
