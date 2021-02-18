const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/', authenticator, handler.auth);
router.post('/login', handler.logIn);
router.post('/logout', authenticator, handler.logOut);

module.exports = router;
