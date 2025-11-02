const Users = require('../models/userModel');

async function getAll(req, res) {
    try {
        const { search } = req.query;
        const { limit, offset } = req.pagination || {};
        const rows = await Users.list({ search, limit, offset });
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch users', details: e.message });
    }
}

async function getOne(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const user = await Users.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch user', details: e.message });
    }
}

async function create(req, res) {
    try {
        const created = await Users.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to create user', details: e.message });
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const existing = await Users.findById(id);
        if (!existing) return res.status(404).json({ error: 'User not found' });
        const updated = await Users.update(id, req.body);
        res.json(updated);
    } catch (e) {
        if (e.message && e.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Failed to update user', details: e.message });
    }
}

async function remove(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const existing = await Users.findById(id);
        if (!existing) return res.status(404).json({ error: 'User not found' });
        await Users.remove(id);
        res.json({ deleted: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete user', details: e.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };

