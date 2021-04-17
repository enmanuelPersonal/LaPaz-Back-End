const { TipoPlan, Vehiculo } = require('../../../db/models/relaciones');

module.exports = {
  async addVehiculo(req, res) {
    const { idMarca, idModelo } = req.body;

    try {
      const data = await Vehiculo.create({
        idMarca,
        idModelo,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllVehiculo(req, res) {
    try {
      const data = await Vehiculo.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
