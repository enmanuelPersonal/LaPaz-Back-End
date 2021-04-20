const { UnidadMedida } = require('../../../db/models/relaciones');

module.exports = {
  async addUnidad(req, res) {
    const { descripcion } = req.body;

    try {
      const UnidadExist = await UnidadMedida.findOne({
        where: { descripcion },
      });

      if (UnidadExist) {
        return res.status(409).send({
          data: UnidadExist,
          message: 'Esta Unidad de medida ya existe.',
        });
      }

      const data = await UnidadMedida.create({
        descripcion,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllUnidad(req, res) {
    try {
      const data = await UnidadMedida.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
