const { Op } = require('sequelize');
const { Calle } = require('../../../db/models/relaciones');
// Los Estrellas
module.exports = {
  async findOrCreateCalle({ calle: descripcion, idSector }) {
    let getCalle;

    try {
      getCalle = await Calle.findOne({
        where: {
          [Op.and]: [{ descripcion }, { idSector }],
        },
      });

      if (!getCalle) {
        getCalle = await Calle.create({
          descripcion,
          idSector,
        });
      }

      return getCalle.idCalle;
    } catch (error) {
      console.log("Error: ", error);
      return false;
    }
  },
};
