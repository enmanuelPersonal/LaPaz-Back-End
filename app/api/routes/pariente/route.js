const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getParientes);
router.get('/:serie', handler.getParienteByIdentidad);
router.get('/client/:idCliente', handler.getParienteByClient);
router.post('/add', handler.addPariente);
router.put('/', handler.updatePariente);

module.exports = router;
