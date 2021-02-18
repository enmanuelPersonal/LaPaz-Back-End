const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addTypeUser);
router.get('/', handler.getAllTypeUser);

module.exports = router;
