const { Suplidor, Producto } = require('../../db/models/relaciones');
// ["chofer"]
module.exports = {
  async findOrCreate({ idSuplidor, idProducto }) {
    let idProduct = [];
    try {
      const getSuplidor = await Suplidor.findOne({
        where: { idSuplidor },
      });

      const getSuplidorProductoAll = await Suplidor.findOne({
        include: [
          {
            model: Producto,
            as: 'SuplidorProducto',
          },
        ],
        where: {
          idSuplidor,
        },
      });

      const { SuplidorProducto } = getSuplidorProductoAll;

      if (SuplidorProducto.length) {
        idProduct = SuplidorProducto.map(({ idProducto }) => idProducto);
      }

      const getSuplidorProducto = await Suplidor.findAll({
        include: [
          {
            model: Producto,
            as: 'SuplidorProducto',
            where: {
              idProducto,
            },
          },
        ],
        where: {
          idSuplidor,
        },
      });

      if (!getSuplidorProducto.length) {
        await getSuplidor.setSuplidorProducto([...idProduct, idProducto]);
      }

      return true;
    } catch (error) {
      return false;
    }
  },
};
