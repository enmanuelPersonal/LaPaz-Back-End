const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addTypeUser);
router.get('/', handler.getAllTypeUser);

module.exports = router;
