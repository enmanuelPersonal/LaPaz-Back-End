const { Op } = require("sequelize");
const {
  ProductoLog,
  ConfSuplidor,
  Pedido,
  DetallePedido,
  ImagenProducto,
  Producto,
  Suplidor,
  Identidad,
  TipoIdentidad,
} = require("../../../db/models/relaciones");
const { personSuplidorParams } = require("../../utils/constant");
const dateDiff = require("../../utils/dateDiff");
const { correoPedido } = require("../correos/sendPedido");
const { pedidosByPrecios } = require("./pedidosByPrecios");
const { pedidosByTiempo } = require("./pedidosByTiempo");

module.exports = {
  async createPedido({ detalle }) {
    let getProdutos = [];
    let getProdutoSuplidor = {};
    const getSuplidores = {};
    let totalSuplidor = {};
    let inPedido = false;

    try {
      await Promise.all(
        detalle.map(async ({ idProducto }) => {
          const getDetallePedidoProducto = await DetallePedido.findAll({
            include: [
              {
                model: Pedido,
                as: "DetallePedidoos",
                where: { status: "Proceso" },
              },
            ],
            where: { idProducto },
          });

          inPedido = getDetallePedidoProducto.length > 0 ? true : false;

          if (!inPedido) {
            const getLog = await ProductoLog.findOne({ where: { idProducto } });

            if (getLog) {
              const { stock, reorden } = getLog;

              if (stock <= reorden) {
                getProdutos.push(idProducto);
              }
            }
          }
        })
      );

      if (getProdutos.length) {
        const { isRequerido } = await ConfSuplidor.findOne({
          where: { validacion: "tiempoEntrega" },
        });

        if (isRequerido) {
          const { data, error } = await pedidosByTiempo({
            getProdutoSuplidor,
            detalle: getProdutos,
          });

          if (!error) {
            getProdutoSuplidor = data;
          }
        } else {
          const { data, error } = await pedidosByPrecios({
            getProdutoSuplidor,
            detalle: getProdutos,
          });

          if (!error) {
            getProdutoSuplidor = data;
          }
        }

        // Hacer pedido by suplidor
        Object.keys(getProdutoSuplidor).forEach((key) => {
          const { idSuplidor, precio, cantidad, imagen, nombre, descripcion } =
            getProdutoSuplidor[key];

          if (getSuplidores.hasOwnProperty([idSuplidor])) {
            totalSuplidor[idSuplidor] =
              totalSuplidor[idSuplidor] + precio * cantidad;

            getSuplidores[idSuplidor] = [
              ...getSuplidores[idSuplidor],
              {
                idProducto: key,
                idSuplidor,
                precio,
                cantidad,
                imagen,
                nombre,
                descripcion,
              },
            ];
          } else {
            totalSuplidor[idSuplidor] = precio * cantidad;
            getSuplidores[idSuplidor] = [
              {
                idProducto: key,
                idSuplidor,
                precio,
                cantidad,
                imagen,
                nombre,
                descripcion,
              },
            ];
          }
        });
        console.log("SUPLIDORES ", getSuplidores);
        await Promise.all(
          Object.keys(getSuplidores).map(async (key) => {
            console.log("---------------", getSuplidores[key]);
            const { numPedido } = await Pedido.create({
              total: totalSuplidor[key],
              status: "Proceso",
              idSuplidor: key,
            });
            console.log("CREE EL PEDIDO", numPedido);
            getSuplidores[key].map(async ({ idProducto, cantidad, precio }) => {
              console.log("Registrando detalle", idProducto);
              await DetallePedido.create({
                numPedido,
                idProducto,
                cantidad,
                precio,
              });
            });
            console.log("TERMINE EL DETALLE");
            const {
              SuplidorPersona: {
                EntidadPersona: { EntidadCorreo },
              },
            } = await Suplidor.findOne({
              where: { idSuplidor: key },
              include: [personSuplidorParams],
            });
            console.log("BUSCANDO EL SUPLIDOR", EntidadCorreo);
            await correoPedido({
              correo: EntidadCorreo[0].correo,
              detalle: getSuplidores[key],
              total: totalSuplidor[key],
            });
            console.log("SE ENVIO EL CORRE");
          })
        );
      }

      return {
        error: false,
      };
    } catch (error) {
      console.log("Error: ", error);
      return true;
    }
  },
};
