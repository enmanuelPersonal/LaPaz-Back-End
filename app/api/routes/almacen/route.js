const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getAllAlmacen);
router.post('/', handler.addAlmacen);
router.post('/add', handler.addProductoAlmacen);

module.exports = router;
