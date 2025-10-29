const knex = require('../database/knex');

function baseQuery() {
    return knex('users').select('id', 'firstname', 'lastname', 'email', 'age', 'role', 'created_at');
}

async function list({ search, limit, offset }) {
    let q = baseQuery();
    if (search) {
        q = q.where(function () {
            this.where('firstname', 'like', `%${search}%`)
                .orWhere('lastname', 'like', `%${search}%`)
                .orWhere('email', 'like', `%${search}%`);
        });
    }
    if (limit !== undefined) q = q.limit(limit);
    if (offset !== undefined) q = q.offset(offset);
    return q;
}

async function findById(id) {
    return baseQuery().where({ id }).first();
}

async function create({ firstname, lastname, email, age, role = 'user' }) {
    const [newId] = await knex('users').insert({ firstname, lastname, email, age, role });
    return findById(newId);
}

async function update(id, data) {
    await knex('users').where({ id }).update(data);
    return findById(id);
}

async function remove(id) {
    return knex('users').where({ id }).del();
}

async function exists(id) {
    const row = await knex('users').where({ id }).first('id');
    return !!row;
}

module.exports = { list, findById, create, update, remove, exists };
