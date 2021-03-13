const { Router } = require('express');

const userRoute = require('./usuario/route');
const userTypeRoute = require('./TipoUsuario/route');
const authRoute = require('./auth/route');
const employeRoute = require('./empleado/route');
const clientRoute = require('./cliente/route');
const parienteRoute = require('./pariente/route');
const deceasedRoute = require('./difunto/route');
const imgRoute = require('./img/route');

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/userType', userTypeRoute);
router.use('/employe', employeRoute);
router.use('/client', clientRoute);
router.use('/pariente', parienteRoute);
router.use('/deceased', deceasedRoute);
router.use('/img', imgRoute);

module.exports = router;
