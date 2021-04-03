const { Router } = require('express');
const { authenticator } = require('../../middlewares');

const handler = require('./handler');

const router = Router();

router.post('/add', authenticator, handler.addPermiso);
router.get('/', authenticator, handler.getAllPermiso);
router.get('/:tipo', authenticator, handler.getPermisoByTypeUsuario);

module.exports = router;
