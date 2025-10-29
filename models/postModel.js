const knex = require('../database/knex');

function baseQuery() {
    return knex('posts').select('id', 'title', 'content', 'user_id', 'created_at');
}

async function list({ search, limit, offset }) {
    let q = baseQuery();
    if (search) {
        q = q.where(function () {
            this.where('title', 'like', `%${search}%`)
                .orWhere('content', 'like', `%${search}%`);
        });
    }
    if (limit !== undefined) q = q.limit(limit);
    if (offset !== undefined) q = q.offset(offset);
    return q;
}

async function findById(id) {
    return baseQuery().where({ id }).first();
}

async function create({ title, content, user_id }) {
    const [newId] = await knex('posts').insert({ title, content, user_id });
    return findById(newId);
}

async function update(id, data) {
    await knex('posts').where({ id }).update(data);
    return findById(id);
}

async function remove(id) {
    return knex('posts').where({ id }).del();
}

module.exports = { list, findById, create, update, remove };
