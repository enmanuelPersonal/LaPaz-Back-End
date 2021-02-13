const { Router } = require('express');

const usuarioRoute = require('./usuario/route');

const router = Router();

router.use('/usuario', usuarioRoute);

module.exports = router;
