const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addUser);

module.exports = router;
