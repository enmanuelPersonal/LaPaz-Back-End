const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getEmployes);
router.get('/:serie', handler.getEmployeByIdentidad);
router.post('/add', handler.addEmploye);
router.put('/', handler.updateEmploye);
router.delete('/', handler.deleteEmploye);

module.exports = router;
