const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addPagoMovil);

module.exports = router;
