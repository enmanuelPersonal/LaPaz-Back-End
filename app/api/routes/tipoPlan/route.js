const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addTypePlan);
router.get('/', handler.getAllTypePlan);

module.exports = router;
