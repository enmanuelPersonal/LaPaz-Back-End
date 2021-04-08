const { Cargo } = require('../../db/models/relaciones');
// ["chofer"]
module.exports = {
  async getCargo({ cargos }) {

    let notError = true,
      array = [];
    try {
      await Promise.all(
        await cargos.map(async (cargo) => {
          const newCargo = await Cargo.findOne({
            where: {
              cargo,
            },
          });

          if (newCargo) {
            array.push(newCargo.idCargo);
          } else {
            notError = false;
          }
        })
      );

      return notError ? array : [];
    } catch (error) {
      return [];
    }
  },
};
