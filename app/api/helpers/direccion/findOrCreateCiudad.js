const { Op } = require('sequelize');
const { Ciudad } = require('../../../db/models/relaciones');
// Santiago
module.exports = {
  async findOrCreateCiudad({ ciudad: descripcion, idRegion }) {
    let getCiudad;

    try {
      getCiudad = await Ciudad.findOne({
        where: {
          [Op.and]: [{ descripcion }, { idRegion }],
        },
      });

      if (!getCiudad) {
        getCiudad = await Ciudad.create({
          descripcion,
          idRegion,
        });
      }

      return getCiudad.idCiudad;
    } catch (error) {
      return false;
    }
  },
};
