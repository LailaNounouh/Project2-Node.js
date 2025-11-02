const express = require('express');
const ctrl = require('../controllers/postController');
const { parsePagination, validatePostCreate, validatePostUpdate } = require('../middleware/validation');
const router = express.Router();

router.get('/', parsePagination, ctrl.getAll);
router.get('/:id', ctrl.getOne);
router.post('/', validatePostCreate, ctrl.create);
router.put('/:id', validatePostUpdate, ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;

