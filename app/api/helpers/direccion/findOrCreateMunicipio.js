const { Op } = require('sequelize');
const { Municipio } = require('../../../db/models/relaciones');
// Punal
module.exports = {
  async findOrCreateMunicipio({ municipio: descripcion, idCiudad }) {
    let getMunicipio;

    try {
      getMunicipio = await Municipio.findOne({
        where: {
          [Op.and]: [{ descripcion }, { idCiudad }],
        },
      });

      if (!getMunicipio) {
        getMunicipio = await Municipio.create({
          descripcion,
          idCiudad,
        });
      }

      return getMunicipio.idMunicipio;
    } catch (error) {
      return false;
    }
  },
};
