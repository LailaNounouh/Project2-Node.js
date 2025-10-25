const knex = require('../db/knex');

exports.getAllUsers = async (req, res) => {
    const { limit, offset } = req.query;
    const users = await knex('users').limit(limit || 100).offset(offset || 0);
    res.json(users);
};

exports.getUserById = async (req, res) => {
    const user = await knex('users').where({ id: req.params.id }).first();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
};

exports.createUser = async (req, res) => {
    const { first_name, last_name, email, age } = req.body;
    if (!first_name || !last_name || !email || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const [id] = await knex('users').insert({ first_name, last_name, email, age });
    res.json({ id });
};

exports.updateUser = async (req, res) => {
    const { first_name, last_name, email, age } = req.body;
    await knex('users').where({ id: req.params.id }).update({ first_name, last_name, email, age });
    res.json({ message: 'User updated' });
};

exports.deleteUser = async (req, res) => {
    await knex('users').where({ id: req.params.id }).del();
    res.json({ message: 'User deleted' });
};
