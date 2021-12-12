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
          await Promise.all(
            getProdutos.map(async (idProducto) => {
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
                getDetallePedidoProducto.map(
                  async ({ numPedido, idProducto, precio }) => {
                    const { cantCompra } = await ProductoLog.findOne({
                      where: { idProducto },
                    });

                    const { nombre, descripcion } = await Producto.findOne({
                      where: { idProducto },
                    });

                    const { url } = await ImagenProducto.findOne({
                      where: { idProducto },
                    });

                    const { createAt, fechaEntrega, idSuplidor } =
                      await Pedido.findOne({
                        where: {
                          [Op.and]: [{ status: "Completado" }, { numPedido }],
                        },
                      });
                    getDias = dateDiff({
                      inicio: createAt,
                      fin: fechaEntrega,
                    });
                    if (getProdutoSuplidor.hasOwnProperty([idProducto])) {
                      if (getProdutoSuplidor[idProducto]["dias"] > getDias) {
                        getProdutoSuplidor[idProducto] = {
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
                      getProdutoSuplidor[idProducto] = {
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
                );
              } else {
                console.log("ESTOY EN PEDIDO 6");
                const { data, error } = await pedidosByPrecios({
                  idProducto,
                  getProdutoSuplidor,
                });

                if (!error) {
                  getProdutoSuplidor = data;
                }
              }
            })
          );
        } else {
          const { data, error } = await pedidosByPrecios({
            getProdutoSuplidor,
            detalle: getProdutos,
          });
          console.log("ESTOY EN PEDIDO 9", data);
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

        await Promise.all(
          Object.keys(getSuplidores).map(async (key) => {
            const { numPedido } = await Pedido.create({
              total: totalSuplidor[key],
              status: "Proceso",
              idSuplidor: key,
            });

            getSuplidores[key].map(async ({ idProducto, cantidad, precio }) => {
              await DetallePedido.create({
                numPedido,
                idProducto,
                cantidad,
                precio,
              });
            });

            const {
              SuplidorPersona: {
                EntidadPersona: { EntidadCorreo },
              },
            } = await Suplidor.findOne({
              where: { idSuplidor: key },
              include: [personSuplidorParams],
            });

            await correoPedido({
              correo: EntidadCorreo[0].correo,
              detalle: getSuplidores[key],
              total: totalSuplidor[key],
            });
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
