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
const permisosRoute = require('./permisos/route');
const categoriaRoute = require('./categoria/route');
const productoRoute = require('./producto/route');
const suplidorRoute = require('./suplidor/route');
const compraRoute = require('./compra/route');
const pagosAppRoute = require('./pagosApp/route');
const ventaRoute = require('./venta/route');
const versionRoute = require('./version/route');
const planRoute = require('./plan/route');
const almacenRoute = require('./almacen/route');
const inventarioRoute = require('./inventario/route');
const vehiculoRoute = require('./vehiculo/route');
const itebisRoute = require('./itebis/route');
const unidadMedidaRoute = require('./UnidadMedida/route');
const metodoPagoRoute = require('./metodoPago/route');
const dasboardRoute = require('./dasboard/route');

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
router.use('/permisos', permisosRoute);
router.use('/categoria', categoriaRoute);
router.use('/producto', productoRoute);
router.use('/suplidor', suplidorRoute);
router.use('/compra', compraRoute);
router.use('/pagosApp', pagosAppRoute);
router.use('/venta', ventaRoute);
router.use('/version', versionRoute);
router.use('/plan', planRoute);
router.use('/almacen', almacenRoute);
router.use('/inventario', inventarioRoute);
router.use('/vehiculo', vehiculoRoute);
router.use('/itebis', itebisRoute);
router.use('/unidadMedida', unidadMedidaRoute);
router.use('/typePago', metodoPagoRoute);
router.use('/dasboard', dasboardRoute);

module.exports = router;
