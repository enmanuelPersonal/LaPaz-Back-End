const { Correo } = require('../../db/models/relaciones');
// ['e@gmail.com','e1@gmail.com']
module.exports = {
  async createCorreo(idEntidad, emails) {
    let notError = true;

    try {
      await Promise.all(
        await emails.map(async (email) => {
          const newEmail = await Correo.create({
            idEntidad,
            correo: email,
          });

          if (!newEmail) {
            notError = false;
          }
        })
      );

      return notError;
    } catch (error) {
      console.log(error);
      return false;
    }
  },
};
