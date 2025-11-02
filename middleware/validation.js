const { exists: userExists } = require('../models/userModel');

function parsePagination(req, res, next) {
    const limit = req.query.limit !== undefined ? parseInt(req.query.limit, 10) : undefined;
    const offset = req.query.offset !== undefined ? parseInt(req.query.offset, 10) : undefined;
    if ((limit !== undefined && Number.isNaN(limit)) || (offset !== undefined && Number.isNaN(offset))) {
        return res.status(400).json({ error: 'Invalid pagination', details: 'limit/offset must be integers' });
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
        return res.status(400).json({ error: 'Invalid name' });
    }
    if (!emailIsValid(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    const ageNum = parseInt(age, 10);
    if (Number.isNaN(ageNum) || ageNum < 0 || ageNum > 120) {
        return res.status(400).json({ error: 'Invalid age' });
    }
    if (role !== undefined && !roleIsValid(role)) {
        return res.status(400).json({ error: 'Invalid role' });
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
        return res.status(400).json({ error: 'Invalid role' });
    }
    next();
}

async function validatePostCreate(req, res, next) {
    const { title, content, user_id } = req.body;
    if (!title || !content || user_id === undefined) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const uid = parseInt(user_id, 10);
    if (Number.isNaN(uid)) return res.status(400).json({ error: 'Invalid user_id' });
    if (!(await userExists(uid))) return res.status(400).json({ error: 'User not found' });
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
        if (Number.isNaN(uid)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }
        req.body.user_id = uid;
    }
    next();
}

module.exports = { parsePagination, validateUserCreate, validateUserUpdate, validatePostCreate, validatePostUpdate };
