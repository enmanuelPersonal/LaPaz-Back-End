const {
  AlmacenMedida,
  Almacen,
  Producto,
} = require('../../../db/models/relaciones');

module.exports = {
  async addAlmacen(req, res) {
    const { nombre, capacidad } = req.body;
    console.log('Estoy aqui 1');
    try {
      const AlmacenExist = await Almacen.findOne({
        where: { nombre },
      });

      if (AlmacenExist) {
        return res.status(409).send({
          data: AlmacenExist,
          message: 'Esta Almacen ya existe.',
        });
      }
      console.log('Estoy aqui');
      const data = await Almacen.create({
        nombre,
        capacidad,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllAlmacen(req, res) {
    try {
      const data = await Almacen.findAll({
        include: [
          {
            model: Producto,
            as: 'AlmacenProducto',
            attributes: ['idProducto', 'nombre', 'descripcion'],
          },
        ],
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async addProductoAlmacen(req, res) {
    const { idAlmacen, productos = [] } = req.body;
    let idProduct = [];
    console.log('object');
    try {
      const AlmacenExist = await Almacen.findOne({
        where: { idAlmacen },
      });

      if (!AlmacenExist) {
        return res.status(409).send({
          data: AlmacenExist,
          message: 'Este Almacen no existe.',
        });
      }

      const getAlmacenProductoAll = await Almacen.findOne({
        include: [
          {
            model: Producto,
            as: 'AlmacenProducto',
          },
        ],
        where: {
          idAlmacen,
        },
      });

      const { AlmacenProducto } = getAlmacenProductoAll;

      if (AlmacenProducto.length) {
        idProduct = AlmacenProducto.map(({ idProducto }) => idProducto);
      }
      await AlmacenExist.setAlmacenProducto([...idProduct, ...productos]);

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
