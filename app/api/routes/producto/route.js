const { Router } = require('express');

const handler = require('./handler');

const router = Router();

router.get('/', handler.getProductos);
router.get('/categoria', handler.getProductosByCategorias);
router.get('/type', handler.getTypeProducto);
router.get('/categorias', handler.getCategoria);
router.get('/:name', handler.getProductoByName);
router.post('/add', handler.addProducto);
router.put('/', handler.updateProducto);
router.delete('/', handler.deleteProducto);

module.exports = router;
