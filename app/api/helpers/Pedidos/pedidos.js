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
          console.log("--------------------------");
          const { data, error } = await pedidosByTiempo({
            getProdutoSuplidor,
            detalle: getProdutos,
          });

          if (!error) {
            console.log("No hay errores ", data);
            getProdutoSuplidor = data;
          }
          // console.log("Estoy aqui");
          // await Promise.all(
          //   getProdutos.map(async (idProducto) => {
          //     const getDetallePedidoProducto = await DetallePedido.findAll({
          //       include: [
          //         {
          //           model: Pedido,
          //           as: "DetallePedidoos",
          //           where: { status: "Completado" },
          //         },
          //       ],
          //       where: { idProducto },
          //     });

          //     if (getDetallePedidoProducto.length) {
          //       getDetallePedidoProducto.map(
          //         async ({ numPedido, idProducto, precio }) => {
          //           console.log("Estoy aqui 1", idProducto, precio);
          //           const { cantCompra } = await ProductoLog.findOne({
          //             where: { idProducto },
          //           });

          //           const { nombre, descripcion } = await Producto.findOne({
          //             where: { idProducto },
          //           });

          //           const { url } = await ImagenProducto.findOne({
          //             where: { idProducto },
          //           });

          //           const { createdAt, fechaEntrega, idSuplidor } =
          //             await Pedido.findOne({
          //               where: {
          //                 [Op.and]: [{ status: "Completado" }, { numPedido }],
          //               },
          //             });

          //           getDias = dateDiff({
          //             inicio: createdAt,
          //             fin: fechaEntrega,
          //           });
          //           console.log("Diferencia de fecha", getDias);
          //           if (getProdutoSuplidor.hasOwnProperty([idProducto])) {
          //             console.log("Estoy en el if ", {
          //               dias: getDias,
          //               idSuplidor,
          //               precio,
          //               cantidad: cantCompra,
          //               imagen: url,
          //               nombre,
          //               descripcion,
          //             });
          //             if (getProdutoSuplidor[idProducto]["dias"] > getDias) {
          //               console.log("Estoy en el if de los dias ", {
          //                 dias: getDias,
          //                 idSuplidor,
          //                 precio,
          //                 cantidad: cantCompra,
          //                 imagen: url,
          //                 nombre,
          //                 descripcion,
          //               });
          //               getProdutoSuplidor[idProducto] = {
          //                 dias: getDias,
          //                 idSuplidor,
          //                 precio,
          //                 cantidad: cantCompra,
          //                 imagen: url,
          //                 nombre,
          //                 descripcion,
          //               };
          //             }
          //           } else {
          //             console.log("Estoy en el else ", {
          //               dias: getDias,
          //               idSuplidor,
          //               precio,
          //               cantidad: cantCompra,
          //               imagen: url,
          //               nombre,
          //               descripcion,
          //             });
          //             getProdutoSuplidor[idProducto] = {
          //               dias: getDias,
          //               idSuplidor,
          //               precio,
          //               cantidad: cantCompra,
          //               imagen: url,
          //               nombre,
          //               descripcion,
          //             };
          //           }
          //         }
          //       );
          //     } else {
          //       const { data, error } = await pedidosByPrecios({
          //         idProducto,
          //         getProdutoSuplidor,
          //       });

          //       if (!error) {
          //         getProdutoSuplidor = data;
          //       }
          //     }
          //   })
          // );
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
        console.log("ESTOY AAAAAAAAA");
        await Promise.all(
          Object.keys(getSuplidores).map(async (key) => {
            console.log("Creando el pedido");
            const { numPedido } = await Pedido.create({
              total: totalSuplidor[key],
              status: "Proceso",
              idSuplidor: key,
              createdAt: "2021-01-12 03:08:35.889+00",
            });

            getSuplidores[key].map(async ({ idProducto, cantidad, precio }) => {
              console.log("Creando el detalle");
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
