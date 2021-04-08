const { TipoIdentidad } = require('../../../db/models/relaciones');

module.exports = {
  async addTypeIdentidad(req, res) {
    const { tipo } = req.body;

    try {
      const identidadTypeExist = await TipoIdentidad.findOne({
        where: { tipo },
      });

      if (identidadTypeExist) {
        return res.status(409).send({
          data: identidadTypeExist,
          message: 'Este Tipo de Identidad ya esta registrado.',
        });
      }

      const data = await TipoIdentidad.create({
        tipo,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllTypeIdentidad(req, res) {
    try {
      const data = await TipoIdentidad.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
