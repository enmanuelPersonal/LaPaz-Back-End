const { Op } = require("sequelize");
const {
  ProductoLog,
  ConfSuplidor,
  Pedido,
  DetallePedido,
} = require("../../../db/models/relaciones");
const dateDiff = require("../../utils/dateDiff");
const { pedidosByPrecios } = require("./pedidosByPrecios");

module.exports = {
  async createPedido({ detalle }) {
    let getProdutos = [];
    let getProdutoSuplidor = {};
    const getSuplidores = {};
    let totalSuplidor = {};
    console.log("ESTOY EN PEDIDO");
    try {
      await Promise.all(
        detalle.map(async ({ idProducto }) => {
          const getLog = await ProductoLog.findOne({ where: { idProducto } });

          if (getLog) {
            const { stock, reorden } = getLog;

            if (stock <= reorden) {
              getProdutos.push(idProducto);
            }
          }
        })
      );
      console.log("ESTOY EN PEDIDO 1", getProdutos);
      if (getProdutos.length) {
        const { isRequerido } = await ConfSuplidor.findOne({
          where: { validacion: "tiempoEntrega" },
        });
        console.log("ESTOY EN PEDIDO 2", isRequerido);
        if (isRequerido) {
          console.log("ESTOY EN PEDIDO 3");
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
              console.log("object ===============> ", getDetallePedidoProducto);
              if (getDetallePedidoProducto.length) {
                console.log("ENTRAAAAAAAAAA");
                getDetallePedidoProducto.map(
                  async ({ numPedido, idProducto, precio, cantidad }) => {
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
                      console.log("ESTOY EN PEDIDO 4");
                      if (getProdutoSuplidor[idProducto]["dias"] > getDias) {
                        getProdutoSuplidor[idProducto] = {
                          dias: getDias,
                          idSuplidor,
                          precio,
                          cantidad,
                        };
                      }
                    } else {
                      console.log("ESTOY EN PEDIDO 5");
                      getProdutoSuplidor[idProducto] = {
                        dias: getDias,
                        idSuplidor,
                        precio,
                        cantidad,
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
                console.log("ESTOY EN PEDIDO 7 ", data);
                if (!error) {
                  getProdutoSuplidor = data;
                  console.log(
                    "PAPOOOOOOOOOOOOOOOOOOOOOOOOOO",
                    error,
                    getProdutoSuplidor
                  );
                }
              }
            })
          );
        } else {
          console.log("ESTOY EN PEDIDO 8");
          const { data, error } = await pedidosByPrecios({
            idProducto,
            getProdutoSuplidor,
            detalle: getProdutos,
          });
          console.log("ESTOY EN PEDIDO 9", data);
          if (!error) {
            getProdutoSuplidor = data;
          }
        }

        // Hacer pedido by suplidor
        console.log("ESTOY EN PEDIDO 10 ", getProdutoSuplidor);
        Object.keys(getProdutoSuplidor).forEach((key) => {
          const { idSuplidor, precio, cantidad } = getProdutoSuplidor[key];
          console.log(
            "1111111111111111111111111111111111111111111111111111 ",
            key
          );
          //   Object.keys(key).map(({ idSuplidor, precio, cantidad }) => {
          console.log(
            "AQUIIIIIIIIIIIIIIIIIIIIIIIIIIII EN KEY ",
            idSuplidor,
            precio,
            cantidad
          );
          if (getSuplidores.hasOwnProperty([idSuplidor])) {
            console.log("-------------------------------------------");
            totalSuplidor[idSuplidor] =
              totalSuplidor[idSuplidor] + precio * cantidad;

            getSuplidores[idSuplidor] = [
              ...getSuplidores[idSuplidor],
              { idProducto: key, cantidad, precio },
            ];
          } else {
            console.log("------------------------------------------- 1");
            totalSuplidor[idSuplidor] = precio * cantidad;
            getSuplidores[idSuplidor] = [{ idProducto: key, cantidad, precio }];
          }
          //   });
        });
        console.log("ESTOY EN PEDIDO 11", getSuplidores);
        await Promise.all(
          Object.keys(getSuplidores).map(async (key) => {
            console.log("cccccccccccccccccccccccccccccccccccccc ", key);
            const { numPedido } = await Pedido.create({
              total: totalSuplidor[key],
              status: "Proceso",
              idSuplidor: key,
            });
            console.log("ESTOY EN PEDIDO 12 ", numPedido);
            getSuplidores[key].map(async ({ idProducto, cantidad, precio }) => {
              await DetallePedido.create({
                numPedido,
                idProducto,
                cantidad,
                precio,
              });
              console.log("ESTOY EN PEDIDO 13");
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
