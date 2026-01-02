const Categories = require('../models/categoryModel');

async function getAll(req, res) {
    try {
        const rows = await Categories.list();
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch categories', details: e.message });
    }
}

async function getOne(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const category = await Categories.findById(id);
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (e) {
        res.status(500).json({ error: 'Failed to fetch category', details: e.message });
    }
}

async function create(req, res) {
    try {
        const created = await Categories.create(req.body);
        res.status(201).json(created);
    } catch (e) {
        res.status(500).json({ error: 'Failed to create category', details: e.message });
    }
}

async function update(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        const updated = await Categories.update(id, req.body);
        res.json(updated);
    } catch (e) {
        res.status(500).json({ error: 'Failed to update category', details: e.message });
    }
}

async function remove(req, res) {
    try {
        const id = parseInt(req.params.id, 10);
        await Categories.remove(id);
        res.json({ deleted: true });
    } catch (e) {
        res.status(500).json({ error: 'Failed to delete category', details: e.message });
    }
}

module.exports = { getAll, getOne, create, update, remove };
