const { DetalleCompra, Compra } = require("../../../db/models/relaciones");

module.exports = {
  async pedidosByPrecios({ idProducto, getProdutoSuplidor, detalle = [] }) {
    let getProdutoSuplidorTemp = getProdutoSuplidor;

    try {
      if (detalle.length) {
        console.log("ESTOY EN PEDIDO POR PRECIO ", detalle);
        await Promise.all(
          detalle.map(async (idProducto) => {
            const getDetalleCompraProducto = await DetalleCompra.findAll({
              // attributes: [
              //     [
              //       sequelize.fn('SUM', sequelize.col('cantidad')),
              //       'cantProducto',
              //     ],
              //     [sequelize.fn('SUM', sequelize.col('precio')), 'sumPrecio'],
              //   ],

              where: {
                idProducto,
              },

              //   group: ['precio'],
            });

            if (getDetalleCompraProducto.length) {
              console.log("ESTOY EN PEDIDO POR PRECIO 1");

              getDetalleCompraProducto.map(
                async ({ idProducto, precio, cantidad, numCompra }) => {
                  const { idSuplidor } = await Compra.findOne({
                    where: { numCompra },
                  });
                  console.log("PUTOOOOOOOOO", idSuplidor);
                  if (getProdutoSuplidorTemp.hasOwnProperty([idProducto])) {
                    console.log("ESTOY EN PEDIDO POR PRECIO 2");
                    if (getProdutoSuplidorTemp[idProducto]["precio"] > precio) {
                      console.log("ESTOY EN PEDIDO POR PRECIO 3");
                      getProdutoSuplidorTemp[idProducto] = {
                        dias: "",
                        idSuplidor,
                        precio,
                        cantidad,
                      };
                    }
                  } else {
                    console.log("ESTOY EN PEDIDO POR PRECIO 4");
                    getProdutoSuplidorTemp[idProducto] = {
                      dias: "",
                      idSuplidor,
                      precio,
                      cantidad,
                    };
                  }
                }
              );
            }
          })
        );
      } else {
        console.log("ESTOY EN PEDIDO POR PRECIO 5");
        const getDetalleCompraProducto = await DetalleCompra.findAll({
          where: { idProducto },
        });
        console.log("==============> ", getDetalleCompraProducto);
        if (getDetalleCompraProducto.length) {
          console.log("ESTOY EN PEDIDO POR PRECIO 6");
          await Promise.all(
            getDetalleCompraProducto.map(
              async ({ idProducto, precio, cantidad, numCompra }) => {
                const { idSuplidor } = await Compra.findOne({
                  where: { numCompra },
                });
                console.log("PUTOOOOOOOOO 1", idSuplidor);
                if (getProdutoSuplidorTemp.hasOwnProperty([idProducto])) {
                  console.log("ESTOY EN PEDIDO POR PRECIO 7");
                  if (getProdutoSuplidorTemp[idProducto]["precio"] > precio) {
                    console.log("ESTOY EN PEDIDO POR PRECIO 8");
                    getProdutoSuplidorTemp[idProducto] = {
                      dias: "",
                      idSuplidor,
                      precio,
                      cantidad,
                    };
                  }
                } else {
                  console.log("ESTOY EN PEDIDO POR PRECIO 9");
                  getProdutoSuplidorTemp[idProducto] = {
                    dias: "",
                    idSuplidor,
                    precio,
                    cantidad,
                  };
                }
              }
            )
          );
        }
      }

      return {
        error: false,
        data: getProdutoSuplidorTemp,
      };
    } catch (error) {
      console.log("Error: ", error);
      return true;
    }
  },
};
