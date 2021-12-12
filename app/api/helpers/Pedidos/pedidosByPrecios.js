const {
  DetalleCompra,
  Compra,
  ProductoLog,
  Producto,
  ImagenProducto,
} = require("../../../db/models/relaciones");

module.exports = {
  async pedidosByPrecios({ idProducto, getProdutoSuplidor, detalle = [] }) {
    let getProdutoSuplidorTemp = getProdutoSuplidor;

    try {
      if (detalle.length) {
        await Promise.all(
          detalle.map(async (idProducto) => {
            const getDetalleCompraProducto = await DetalleCompra.findAll({
              where: {
                idProducto,
              },
            });

            if (getDetalleCompraProducto.length) {
              await Promise.all(
                getDetalleCompraProducto.map(
                  async ({ idProducto, precio, numCompra }) => {
                    const { cantCompra } = await ProductoLog.findOne({
                      where: { idProducto },
                    });

                    const { nombre, descripcion } = await Producto.findOne({
                      where: { idProducto },
                    });

                    const { url } = await ImagenProducto.findOne({
                      where: { idProducto },
                    });

                    const { idSuplidor } = await Compra.findOne({
                      where: { numCompra },
                    });

                    if (getProdutoSuplidorTemp.hasOwnProperty([idProducto])) {
                      if (
                        getProdutoSuplidorTemp[idProducto]["precio"] > precio
                      ) {
                        getProdutoSuplidorTemp[idProducto] = {
                          dias: "",
                          idSuplidor,
                          precio,
                          cantidad: cantCompra,
                          imagen: url,
                          nombre,
                          descripcion,
                        };
                      }
                    } else {
                      getProdutoSuplidorTemp[idProducto] = {
                        dias: "",
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
            }
          })
        );
      } else {
        const getDetalleCompraProducto = await DetalleCompra.findAll({
          where: { idProducto },
        });

        if (getDetalleCompraProducto.length) {
          await Promise.all(
            getDetalleCompraProducto.map(
              async ({ idProducto, precio, numCompra }) => {
                const { cantCompra } = await ProductoLog.findOne({
                  where: { idProducto },
                });

                const { nombre, descripcion } = await Producto.findOne({
                  where: { idProducto },
                });

                const { url } = await ImagenProducto.findOne({
                  where: { idProducto },
                });

                const { idSuplidor } = await Compra.findOne({
                  where: { numCompra },
                });

                if (getProdutoSuplidorTemp.hasOwnProperty([idProducto])) {
                  if (getProdutoSuplidorTemp[idProducto]["precio"] > precio) {
                    getProdutoSuplidorTemp[idProducto] = {
                      dias: "",
                      idSuplidor,
                      precio,
                      cantidad: cantCompra,
                      imagen: url,
                      nombre,
                      descripcion,
                    };
                  }
                } else {
                  getProdutoSuplidorTemp[idProducto] = {
                    dias: "",
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
