const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getClients);
router.get('/:finder', handler.getClientsByIdentidad);
router.post('/add', handler.addClient);
router.put('/', handler.updateClient);
router.delete('/', handler.deleteClient);

module.exports = router;
