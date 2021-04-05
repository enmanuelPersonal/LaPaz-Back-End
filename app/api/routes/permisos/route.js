const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', handler.addPermiso);
router.get('/', handler.getAllPermiso);
router.get('/:idTipoUsuario', handler.getPermisoByTypeUsuario);

module.exports = router;
