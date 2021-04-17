const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/:idTipoPlan', handler.getArmadoByType);
router.post('/add', handler.addArmado);
router.put('/', handler.updateArmado);
router.delete('/', handler.DeleteArmado);

module.exports = router;
