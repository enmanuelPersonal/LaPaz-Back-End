const { Router } = require('express');

const userRoute = require('./usuario/route');
const userTypeRoute = require('./TipoUsuario/route');
const authRoute = require('./auth/route');
const employeRoute = require('./empleado/route');
const clientRoute = require('./cliente/route');
const parienteRoute = require('./pariente/route');
const deceasedRoute = require('./difunto/route');
const identityRoute = require('./identidad/route');
const identityTypeRoute = require('./tipoIdentidad/route');
const cargoRoute = require('./cargo/route');
const suscripcionRoute = require('./suscripcion/route');
const imgRoute = require('./img/route');
const mensualidadRoute = require('./mensualidad/route');
const tipoPlandRoute = require('./tipoPlan/route');

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/userType', userTypeRoute);
router.use('/employe', employeRoute);
router.use('/client', clientRoute);
router.use('/pariente', parienteRoute);
router.use('/deceased', deceasedRoute);
router.use('/identity', identityRoute);
router.use('/typeIdentity', identityTypeRoute);
router.use('/cargo', cargoRoute);
router.use('/suscripcion', suscripcionRoute);
router.use('/img', imgRoute);
router.use('/mensualidad', mensualidadRoute);
router.use('/typePlan', tipoPlandRoute);

module.exports = router;
