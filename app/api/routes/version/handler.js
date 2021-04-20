const { Versiones } = require("../../../db/models/relaciones");

module.exports = {
  async addVersion(req, res) {
    const { mayor, menor, revision, fechaFin } = req.body;

    try {
      const data = await Versiones.create({
        mayor,
        menor,
        revision,
        fechaFin,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllVersiones(req, res) {
    try {
      const data = await Versiones.findAll({
        order: [['createdAt', 'DESC']],
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
