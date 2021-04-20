const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addUnidad);
router.get('/', handler.getAllUnidad);

module.exports = router;
