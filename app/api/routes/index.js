const { Router } = require('express');

const userRoute = require('./usuario/route');
const userTypeRoute = require('./TipoUsuario/route');
const authRoute = require('./auth/route');
const employeRoute = require('./empleado/route');

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/userType', userTypeRoute);
router.use('/employe', employeRoute);

module.exports = router;
