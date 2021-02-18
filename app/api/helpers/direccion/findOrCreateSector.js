const { Op } = require('sequelize');
const { Sector } = require('../../../db/models/relaciones');
// Laguna Prieta
module.exports = {
  async findOrCreateSector({ sector: descripcion, idMunicipio }) {
    let getSector;

    try {
      getSector = await Sector.findOne({
        where: {
          [Op.and]: [{ descripcion }, { idMunicipio }],
        },
      });

      if (!getSector) {
        getSector = await Sector.create({
          descripcion,
          idMunicipio,
        });
      }

      return getSector.idSector;
    } catch (error) {
      return false;
    }
  },
};
