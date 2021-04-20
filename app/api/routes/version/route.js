const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addVersion);
router.get('/', handler.getAllVersiones);

module.exports = router;
