const { Op } = require('sequelize');
const { Casa } = require('../../../db/models/relaciones');
// 16, frete a la banca
module.exports = {
  async findOrCreateCasa({ casa: numero, referencia, idCalle }) {
    let getCasa;

    try {
      getCasa = await Casa.findOne({
        where: {
          [Op.and]: [{ numero }, { referencia }, { idCalle }],
        },
      });

      if (!getCasa) {
        getCasa = await Casa.create({
          numero,
          referencia,
          idCalle,
        });
      }

      return getCasa.idCasa;
    } catch (error) {
      return false;
    }
  },
};
