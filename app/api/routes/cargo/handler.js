const { Cargo } = require('../../../db/models/relaciones');

module.exports = {
  async addTypeCargo(req, res) {
    const { cargo, salario } = req.body;

    try {
      const cargoTypeExist = await Cargo.findOne({
        where: { cargo },
      });

      if (cargoTypeExist) {
        return res.status(409).send({
          data: cargoTypeExist,
          message: 'Este Cargo ya esta registrado.',
        });
      }

      const data = await Cargo.create({
        cargo,
        salario,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllCargo(req, res) {
    try {
      const data = await Cargo.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
