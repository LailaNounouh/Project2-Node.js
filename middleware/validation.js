const { exists: userExists } = require('../models/userModel');

function parsePagination(req, res, next) {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : undefined;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : undefined;

    if ((limit !== undefined && Number.isNaN(limit)) || (offset !== undefined && Number.isNaN(offset))) {
        return res.status(400).json({ error: 'Invalid pagination', details: 'limit/offset must be integers' });
    }
    if (limit !== undefined && (limit < 1 || limit > 100)) {
        return res.status(400).json({ error: 'Invalid pagination', details: 'limit must be between 1 and 100' });
    }
    if (offset !== undefined && offset < 0) {
        return res.status(400).json({ error: 'Invalid pagination', details: 'offset must be >= 0' });
    }
    req.pagination = { limit, offset };
    next();
}

function nameIsValid(name) {
    return typeof name === 'string' && /^[A-Za-zÀ-ÖØ-öø-ÿ' -]{2,}$/.test(name.trim());
}

function emailIsValid(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function roleIsValid(role) {
    return ['user', 'admin'].includes(role);
}

function validateUserCreate(req, res, next) {
    const { firstname, lastname, email, age, role } = req.body;
    if (!firstname || !lastname || !email || age === undefined) {
        return res.status(400).json({ error: 'Missing fields', details: 'firstname, lastname, email, age are required' });
    }
    if (!nameIsValid(firstname) || !nameIsValid(lastname)) {
        return res.status(400).json({ error: 'Invalid name', details: 'Names must be letters/spaces only (min 2 chars)' });
    }
    if (!emailIsValid(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    const ageNum = parseInt(age, 10);
    if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        return res.status(400).json({ error: 'Invalid age', details: 'Age must be an integer between 0 and 120' });
    }
    if (role !== undefined && !roleIsValid(role)) {
        return res.status(400).json({ error: 'Invalid role', details: 'role must be user or admin' });
    }
    req.body.age = ageNum;
    next();
}

function validateUserUpdate(req, res, next) {
    const { firstname, lastname, email, age, role } = req.body;
    if (firstname !== undefined && !nameIsValid(firstname)) {
        return res.status(400).json({ error: 'Invalid firstname' });
    }
    if (lastname !== undefined && !nameIsValid(lastname)) {
        return res.status(400).json({ error: 'Invalid lastname' });
    }
    if (email !== undefined && !emailIsValid(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    if (age !== undefined) {
        const ageNum = parseInt(age, 10);
        if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
            return res.status(400).json({ error: 'Invalid age' });
        }
        req.body.age = ageNum;
    }
    if (role !== undefined && !roleIsValid(role)) {
        return res.status(400).json({ error: 'Invalid role', details: 'role must be user or admin' });
    }
    next();
}

async function validatePostCreate(req, res, next) {
    const { title, content, user_id } = req.body;
    if (!title || !content || user_id === undefined) {
        return res.status(400).json({ error: 'Missing fields', details: 'title, content, user_id are required' });
    }
    if (typeof title !== 'string' || title.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid title' });
    }
    if (typeof content !== 'string' || content.trim().length < 2) {
        return res.status(400).json({ error: 'Invalid content' });
    }
    const uid = parseInt(user_id, 10);
    if (Number.isNaN(uid) || uid < 1) {
        return res.status(400).json({ error: 'Invalid user_id' });
    }
    if (!(await userExists(uid))) {
        return res.status(400).json({ error: 'User not found', details: 'user_id must reference an existing user' });
    }
    req.body.user_id = uid;
    next();
}

function validatePostUpdate(req, res, next) {
    const { title, content, user_id } = req.body;
    if (title !== undefined && (typeof title !== 'string' || title.trim().length < 2)) {
        return res.status(400).json({ error: 'Invalid title' });
    }
    if (content !== undefined && (typeof content !== 'string' || content.trim().length < 2)) {
        return res.status(400).json({ error: 'Invalid content' });
    }
    if (user_id !== undefined) {
        const uid = parseInt(user_id, 10);
        if (Number.isNaN(uid) || uid < 1) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }
        req.body.user_id = uid;
    }
    next();
}

module.exports = {
    parsePagination,
    validateUserCreate,
    validateUserUpdate,
    validatePostCreate,
    validatePostUpdate,
};
