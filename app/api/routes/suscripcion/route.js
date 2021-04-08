const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getSuscripciones);
router.get('/:idCliente', handler.getSuscripcionByClient);
router.post('/add', handler.addSuscripcion);
router.put('/', handler.updateSuscripcion);
router.delete('/', handler.deleteSuscripcion);

module.exports = router;
