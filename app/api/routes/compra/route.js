const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getCompra);
router.post('/add', handler.addCompra);

module.exports = router;
