const { TipoPlan } = require('../../../db/models/relaciones');

module.exports = {
  async addTypePlan(req, res) {
    const { tipo, monto } = req.body;

    try {
      const planTypeExist = await TipoPlan.findOne({
        where: { tipo },
      });

      if (planTypeExist) {
        return res.status(409).send({
          data: planTypeExist,
          message: 'Este Tipo de Plan ya esta registrado.',
        });
      }

      const data = await TipoPlan.create({
        tipo,
        monto,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllTypePlan(req, res) {
    try {
      const data = await TipoPlan.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
