const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addTypeIdentidad);
router.get('/', handler.getAllTypeIdentidad);

module.exports = router;
