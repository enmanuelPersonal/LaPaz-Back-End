const { Telefono } = require('../../db/models/relaciones');
// [{telefono: 8096125752, tipo:'121qwqwqw121'}]
module.exports = {
  async createTelefono({ idEntidad, telefonos, transaction }) {
    let notError = true;
    try {
      await Promise.all(
        await telefonos.map(async (phone) => {
          const { telefono, tipo } = phone;

          const newTelefono = await Telefono.create(
            {
              idEntidad,
              telefono,
              idTipoTelefono: tipo,
            },
            { transaction }
          );

          if (!newTelefono) {
            notError = false;
          }
        })
      );

      return notError;
    } catch (error) {
      return false;
    }
  },
};
