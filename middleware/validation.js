exports.validateUser = (req, res, next) => {
    const { first_name, last_name, email, age } = req.body;
    if (!first_name || !last_name || !email || !age) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (/\d/.test(first_name)) return res.status(400).json({ error: 'First name cannot contain numbers' });
    if (isNaN(age)) return res.status(400).json({ error: 'Age must be a number' });
    next();
};
