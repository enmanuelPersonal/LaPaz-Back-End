const { Modelo, Vehiculo, Marca } = require('../../../db/models/relaciones');

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
    let parseData = [];
    try {
      const data = await Vehiculo.findAll({
        include: [
          { model: Marca, as: 'VehiculoMarca' },
          { model: Modelo, as: 'VehiculoModelo' },
        ],
      });

      if (data.length) {
        parseData = data.map(
          ({
            idVehiculo,
            status,
            VehiculoMarca: { marca },
            VehiculoModelo: { modelo },
          }) => ({
            idVehiculo,
            status,
            marca,
            modelo,
          })
        );
      }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
