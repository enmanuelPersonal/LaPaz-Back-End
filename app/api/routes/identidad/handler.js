const { TipoIdentidad } = require('../../../db/models/relaciones');

module.exports = {
  async getAllTypeIdentidad(req, res) {
    try {
      const data = await TipoIdentidad.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
