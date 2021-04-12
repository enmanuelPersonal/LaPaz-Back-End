const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getMensualidades);
// router.get('/:idCliente', handler.getSuscripcionByClient);
router.post('/', handler.addMensualidadClient);
router.post('/add', handler.addMensualidad);
// router.put('/', handler.updateSuscripcion);
// router.delete('/', handler.deleteSuscripcion);

module.exports = router;
