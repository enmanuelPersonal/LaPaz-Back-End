const { Op } = require("sequelize");
const {
  DetallePedido,
  Pedido,
  ProductoLog,
  Producto,
  ImagenProducto,
} = require("../../../db/models/relaciones");
const dateDiff = require("../../utils/dateDiff");
const { pedidosByPrecios } = require("./pedidosByPrecios");

module.exports = {
  async pedidosByTiempo({ getProdutoSuplidor, detalle = [] }) {
    let getProdutoSuplidorTemp = getProdutoSuplidor;

    try {
      if (detalle.length) {
        console.log("Estoy aqui");
        await Promise.all(
          detalle.map(async (idProducto) => {
            const getDetallePedidoProducto = await DetallePedido.findAll({
              include: [
                {
                  model: Pedido,
                  as: "DetallePedidoos",
                  where: { status: "Completado" },
                },
              ],
              where: { idProducto },
            });

            if (getDetallePedidoProducto.length) {
              await Promise.all(
                getDetallePedidoProducto.map(
                  async ({ numPedido, idProducto, precio }) => {
                    console.log("Estoy aqui 1", idProducto, precio);
                    const { cantCompra } = await ProductoLog.findOne({
                      where: { idProducto },
                    });

                    const { nombre, descripcion } = await Producto.findOne({
                      where: { idProducto },
                    });

                    const { url } = await ImagenProducto.findOne({
                      where: { idProducto },
                    });

                    const { createdAt, fechaEntrega, idSuplidor } =
                      await Pedido.findOne({
                        where: {
                          [Op.and]: [{ status: "Completado" }, { numPedido }],
                        },
                      });

                    getDias = dateDiff({
                      inicio: createdAt,
                      fin: fechaEntrega,
                    });
                    console.log("Diferencia de fecha", getDias);
                    if (getProdutoSuplidorTemp.hasOwnProperty([idProducto])) {
                      console.log("Estoy en el if ", {
                        dias: getDias,
                        idSuplidor,
                        precio,
                        cantidad: cantCompra,
                        imagen: url,
                        nombre,
                        descripcion,
                      });
                      if (
                        getProdutoSuplidorTemp[idProducto]["dias"] > getDias
                      ) {
                        console.log("Estoy en el if de los dias ", {
                          dias: getDias,
                          idSuplidor,
                          precio,
                          cantidad: cantCompra,
                          imagen: url,
                          nombre,
                          descripcion,
                        });
                        getProdutoSuplidorTemp[idProducto] = {
                          dias: getDias,
                          idSuplidor,
                          precio,
                          cantidad: cantCompra,
                          imagen: url,
                          nombre,
                          descripcion,
                        };
                      }
                    } else {
                      console.log("Estoy en el else ", {
                        dias: getDias,
                        idSuplidor,
                        precio,
                        cantidad: cantCompra,
                        imagen: url,
                        nombre,
                        descripcion,
                      });
                      getProdutoSuplidorTemp[idProducto] = {
                        dias: getDias,
                        idSuplidor,
                        precio,
                        cantidad: cantCompra,
                        imagen: url,
                        nombre,
                        descripcion,
                      };
                    }
                  }
                )
              );
            } else {
              const { data, error } = await pedidosByPrecios({
                idProducto,
                getProdutoSuplidorTemp,
              });

              if (!error) {
                getProdutoSuplidorTemp = data;
              }
            }
          })
        );
      }

      return {
        error: false,
        data: getProdutoSuplidorTemp,
      };
    } catch (error) {
      console.log("Error: ", error);
      return {
        error: true,
        data: {},
      };
    }
  },
};
