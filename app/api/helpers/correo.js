const { Correo } = require('../../db/models/relaciones');
// ['e@gmail.com','e1@gmail.com']
module.exports = {
  async createCorreo({ idEntidad, correos, transaction }) {
    let notError = true;

    try {
      await Promise.all(
        await correos.map(async (email) => {
          const newEmail = await Correo.create(
            {
              idEntidad,
              correo: email,
            },
            { transaction }
          );

          if (!newEmail) {
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
