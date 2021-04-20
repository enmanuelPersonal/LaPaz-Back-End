const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addCategoria);
router.get('/', handler.getAllCategoria);

module.exports = router;
