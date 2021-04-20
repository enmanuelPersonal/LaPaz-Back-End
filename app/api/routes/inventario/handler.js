const { Op } = require('sequelize');
const {
  Producto,
  ImagenProducto,
  ProductoLog,
  TipoProducto,
  Categoria,
  Almacen,
} = require('../../../db/models/relaciones');

module.exports = {
  async getProductos(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const productos = await Producto.findAll({
        include: [
          {
            model: TipoProducto,
            as: 'ProductoTipo',
          },
          {
            model: Categoria,
            as: 'ProductoCategoria',
          },
          {
            model: Almacen,
            as: 'ProductoAmacen',
          },
        ],
        order: [['updatedAt', 'DESC']],
      });

      if (productos.length) {
        await Promise.all(
          await productos.map(async (producto) => {
            let getImagen = [];
            let getLog = {};
            let parseGetImagen = [];
            let parseGetLog = {};
            let getAlmacen = '';

            const {
              idProducto,
              nombre,
              descripcion,
              idTipoProducto,
              ProductoTipo: { tipo },
              idCategoria,
              ProductoCategoria: { categoria },
              ProductoAmacen,
            } = producto;

            getImagen = await ImagenProducto.findAll({
              where: { idProducto },
            });

            if (getImagen.length) {
              parseGetImagen = getImagen.map(({ idImagenProducto, url }) => ({
                idImagenProducto,
                url,
              }));
            }

            getLog = await ProductoLog.findOne({
              where: { idProducto },
            });

            if (getLog) {
              const { idProductoLog, stock, costo, precio, reorden } = getLog;

              parseGetLog = { idProductoLog, stock, costo, precio, reorden };
            }

            if (ProductoAmacen.length) {
              getAlmacen = ProductoAmacen[0].nombre;
            }

            return parseData.push({
              idProducto,
              descripcion,
              idTipoProducto,
              tipo,
              idCategoria,
              categoria,
              nombre,
              log: parseGetLog,
              imagenes: parseGetImagen,
              almacen: getAlmacen,
            });
          })
        );
      }

      if (parseData.length > limit) {
        parseData = parseData.slice(0, limit + 1);
      }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
