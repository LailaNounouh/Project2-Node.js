const express = require('express');
const ctrl = require('../controllers/userController');
const { parsePagination, validateUserCreate, validateUserUpdate } = require('../middleware/validation');

const router = express.Router();

router.get('/', parsePagination, ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', validateUserCreate, ctrl.create);
router.put('/:id', validateUserUpdate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
