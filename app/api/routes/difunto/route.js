const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getDeceased);
router.get('/:serie', handler.getDeceasedByIdentidad);
router.get('/client/:idCliente', handler.getDeceasedByClient);
router.post('/add', handler.addDeceased);
router.put('/', handler.updateDeceased);

module.exports = router;
