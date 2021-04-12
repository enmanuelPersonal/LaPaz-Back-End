const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getVenta);
router.get('/:idEntidad', handler.getVentaByCliente);
router.post('/add', handler.addVenta);
router.post('/', handler.addVentaByIdEntidad);
// router.put('/', handler.updateUser);
// router.delete('/', handler.deleteUser);

module.exports = router;
