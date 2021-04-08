const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getSuplidores);
router.get('/:finder', handler.getSuplidorByIdentidad);
router.post('/add', handler.addSuplidor);
router.put('/', handler.updateSuplidor);
router.delete('/', handler.deleteSuplidor);

module.exports = router;
