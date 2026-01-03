const express = require('express');
const ctrl = require('../controllers/categoryController');
const { validateCategoryCreate, validateCategoryUpdate } = require('../middleware/validation');
const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', validateCategoryCreate, ctrl.create);
router.put('/:id', validateCategoryUpdate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
