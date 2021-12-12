const { Router } = require("express");

const handler = require("./handler");

const router = Router();

router.get("/suplidor", handler.getConfSuplidor);
router.get("/:status", handler.getPedidosByStatus);
router.get("/", handler.getAllPedidos);
router.put("/suplidor", handler.updateConfSuplidor);
router.put("/", handler.updatePedido);
router.delete("/", handler.DeletePedido);

module.exports = router;
