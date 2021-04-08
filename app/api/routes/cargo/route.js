const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addTypeCargo);
router.get('/', handler.getAllCargo);

module.exports = router;
