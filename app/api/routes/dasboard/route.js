const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/ingresos', handler.getIngresos);
router.get('/suscripcion', handler.getTotalSuscripcion);
router.get('/pariente', handler.getTotalParientes);
router.get('/mes', handler.getTotalVentaMes);
router.get('/mesTotal', handler.getTotalVentaYearByMes);
router.get('/mesSuscripcion', handler.getTotalSuscripcionMes);

module.exports = router;
