const { Router } = require('express');

const userRoute = require('./usuario/route');
const userTypeRoute = require('./TipoUsuario/route');

const router = Router();

router.use('/user', userRoute);
router.use('/userType', userTypeRoute);

module.exports = router;
