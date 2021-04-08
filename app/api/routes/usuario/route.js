const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getUser);
router.post('/add', handler.addUser);
router.put('/', handler.updateUser);
router.delete('/', handler.deleteUser);

module.exports = router;
