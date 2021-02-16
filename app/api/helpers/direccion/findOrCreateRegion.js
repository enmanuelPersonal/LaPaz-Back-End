const { Op } = require('sequelize');
const { Region } = require('../../../db/models/relaciones');
// Norte
module.exports = {
  async findOrCreateRegion({ region: descripcion, idPais }) {
    let getRegion;

    try {
      getRegion = await Region.findOne({
        where: {
          [Op.and]: [{ descripcion }, { idPais }],
        },
      });

      if (!getRegion) {
        getRegion = await Region.create({
          descripcion,
          idPais,
        });
      }

      return getRegion.idRegion;
    } catch (error) {
      return false;
    }
  },
};
