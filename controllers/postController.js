const Posts = require('../models/postModel');
const Users = require('../models/userModel');

async function getAll(req, res) {
    try {
        const { search } = req.query;
        const { limit, offset } = req.pagination || {};
        const rows = await Posts.list({ search, limit, offset });
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch posts', details: e.message });
    }
}

async function getOne(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const post = await Posts.findById(id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch post', details: e.message });
    }
}

async function create(req, res) {
    try {
        const { user_id } = req.body;
        if (!(await Users.exists(user_id))) {
            return res.status(400).json({ error: 'User not found', details: 'user_id must reference an existing user' });
        }
        const created = await Posts.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create post', details: e.message });
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const existing = await Posts.findById(id);
        if (!existing) return res.status(404).json({ error: 'Post not found' });
        if (req.body.user_id !== undefined) {
            const uid = parseInt(req.body.user_id, 10);
            if (!(await Users.exists(uid))) {
                return res.status(400).json({ error: 'User not found', details: 'user_id must reference an existing user' });
            }
        }
        const updated = await Posts.update(id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update post', details: e.message });
    }
}

async function remove(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid id' });
        const existing = await Posts.findById(id);
        if (!existing) return res.status(404).json({ error: 'Post not found' });
        await Posts.remove(id);
        res.json({ deleted: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete post', details: e.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };
