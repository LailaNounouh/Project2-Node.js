
const knex = require('../database/knex');

async function createTables() {
    const hasUsers = await knex.schema.hasTable('users');
    if (!hasUsers) {
        await knex.schema.createTable('users', (table) => {
            table.increments('id').primary();
            table.string('firstname').notNullable();
            table.string('lastname').notNullable();
            table.string('email').notNullable().unique();
            table.string('role').notNullable().defaultTo('user');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
        console.log('Table "users" created');
    } else {
        console.log(' Table "users" already exists');
    }

    const hasPosts = await knex.schema.hasTable('posts');
    if (!hasPosts) {
        await knex.schema.createTable('posts', (table) => {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('content').notNullable();
            table.integer('author_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
        console.log(' Table "posts" created');
    } else {
        console.log(' Table "posts" already exists');
    }
}

async function seedMinimal() {
    const usersCount = (await knex('users').count({ c: '*' }))[0].c;
    if (Number(usersCount) === 0) {
        await knex('users').insert([
            { firstname: 'Laila', lastname: 'Nounouh', email: 'laila@example.com', role: 'admin' },
            { firstname: 'Mona', lastname: 'Example', email: 'mona@example.com', role: 'user' },
        ]);
        console.log(' Seeded users');
    }

    const postsCount = (await knex('posts').count({ c: '*' }))[0].c;
    if (Number(postsCount) === 0) {
        await knex('posts').insert([
            { title: 'Welkom bij Beauty Connect', content: 'Eerste nieuwsbericht', author_id: 1 },
        ]);
        console.log(' Seeded posts');
    }
}

(async () => {
    try {
        await createTables();
        await seedMinimal();
    } catch (e) {
        console.error(' DB init error:', e.message);
    } finally {
        await knex.destroy();
    }
})();
