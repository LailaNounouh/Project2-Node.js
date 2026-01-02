const knex = require('../database/knex');

function baseQuery() {
    return knex('categories').select('id', 'name', 'description');
}

async function list({ sort, order } = {}) {
  let q = baseQuery();
  const allowedSort = ['id', 'name'];
  if (sort && allowedSort.includes(sort)) {
    const direction = order === 'desc' ? 'desc' : 'asc';
    q = q.orderBy(sort, direction);
  }
  return q;
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
