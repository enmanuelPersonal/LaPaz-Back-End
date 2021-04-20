const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.post('/', handler.addVehiculo);
router.get('/', handler.getAllVehiculo);

module.exports = router;
