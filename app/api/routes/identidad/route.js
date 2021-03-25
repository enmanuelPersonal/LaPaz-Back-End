const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getAllTypeIdentidad);

module.exports = router;
