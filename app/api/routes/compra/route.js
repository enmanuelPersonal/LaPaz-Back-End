const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getCompra);
router.post('/add', handler.addCompra);
// router.put('/', handler.updateUser);
// router.delete('/', handler.deleteUser);

module.exports = router;
