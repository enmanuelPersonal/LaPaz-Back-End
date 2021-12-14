const { sequelize } = require("../../../db/config/database");
const {
  Entidad,
  TipoProducto,
  Suplidor,
  Compra,
  DetalleCompra,
  Producto,
  ProductoLog,
  TipoPago,
  Persona,
} = require("../../../db/models/relaciones");
const { findOrCreate } = require("../../helpers/productoSuplidor");
// {
//   "idSuplidor": "sdssdwewedcd",
//     "detalle": [{numCompra: "we233", idProducto: "wedw232", cantidad: 12, precio: 200}],
//     "tipoPagos":["2c961280-b2b5-4188-aa01-8e47a524c362"],
//     "total": 200
// }
module.exports = {
  async addCompraByPedido({ idSuplidor, detalle, total, numPedido }) {
    let data = {};

    try {
      const suplidorExist = await Suplidor.findOne({
        where: { idSuplidor },
      });

      if (!suplidorExist) {
        return res.status(409).send({
          data: suplidorExist,
          message: "Este Suplidor no existe.",
        });
      }

      if (!detalle.length) {
        return res.status(409).send({
          data: [],
          message: "Debe tener productos seleccionados.",
        });
      }

      // if (!tipoPagos.length) {
      //   return res.status(409).send({
      //     data: [],
      //     message: 'Debe tener un tipo de pago.',
      //   });
      // }

      const { idTipoPago } = await TipoPago.findOne({
        where: { tipo: "Efectivo" },
      });

      data = await Compra.create({
        idSuplidor,
        total,
        createdAt: "2021-01-20 03:08:35.889+00",
        updatedAt: "2021-01-20 03:08:35.889+00",
      });

      const { numCompra } = data;

      if (idTipoPago) {
        await data.setCompraTipoPago([idTipoPago]);
        await data.setCompraPedido([numPedido]);
      }

      await Promise.all(
        detalle.map(async ({ idProducto, cantidad, precio }) => {
          await DetalleCompra.create({
            numCompra,
            idProducto,
            cantidad,
            precio,
            createdAt: "2021-01-20 03:08:35.889+00",
            updatedAt: "2021-01-20 03:08:35.889+00",
          });

          await findOrCreate({ idSuplidor, idProducto });

          const getLog = await ProductoLog.findOne({ where: { idProducto } });

          if (getLog) {
            const { stock } = getLog;

            const productos = await Producto.findOne({
              include: [
                {
                  model: TipoProducto,
                  as: "ProductoTipo",
                  where: { tipo: "producto" },
                },
              ],
              where: { idProducto },
            });

            let getSumaResult = 0;
            let getSumaCantidad = 0;

            const getDetalle = await DetalleCompra.findAll({
              attributes: [
                [
                  sequelize.fn("SUM", sequelize.col("cantidad")),
                  "cantProducto",
                ],
                [sequelize.fn("SUM", sequelize.col("precio")), "sumPrecio"],
              ],

              where: {
                idProducto,
              },

              group: ["precio"],
            });

            getDetalle.forEach(
              ({ dataValues: { cantProducto, sumPrecio } }) => {
                getSumaResult += parseInt(cantProducto) * sumPrecio;
                getSumaCantidad += parseInt(cantProducto);
              }
            );

            const resPrecio = Math.round(getSumaResult / getSumaCantidad);

            if (productos) {
              await ProductoLog.update(
                {
                  stock: stock + cantidad,
                  costo: resPrecio,
                  precio: resPrecio * 1.05,
                },
                { where: { idProducto } }
              );
            } else {
              await ProductoLog.update(
                {
                  stock: stock + cantidad,
                  costo: resPrecio,
                },
                { where: { idProducto } }
              );
            }
          }
        })
      );

      return {
        error: false,
        data,
      };
    } catch (error) {
      console.log("Error: ", error);
      return {
        error: true,
        data: "",
      };
    }
  },
};
