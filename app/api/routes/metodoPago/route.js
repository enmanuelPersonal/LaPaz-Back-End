const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getAllMetodoPago);

module.exports = router;
