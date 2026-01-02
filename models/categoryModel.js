const knex = require('../database/knex');

function baseQuery() {
    return knex('categories').select('id', 'name', 'description');
}

async function list() {
    return baseQuery();
}

async function findById(id) {
    return baseQuery().where({ id }).first();
}

async function create({ name, description }) {
    const [newId] = await knex('categories').insert({ name, description });
    return findById(newId);
}

async function update(id, data) {
    await knex('categories').where({ id }).update(data);
    return findById(id);
}

async function remove(id) {
    return knex('categories').where({ id }).del();
}

module.exports = { list, findById, create, update, remove };
