const { Telefono, TipoTelefono } = require('../../db/models/relaciones');
// [{telefono: 8096125752, tipo:'casa'}]
module.exports = {
  async createTelefono({ idEntidad, telefonos, transaction }) {
    let notError = true;
    try {
      await Promise.all(
        await telefonos.map(async (phone) => {
          const { telefono, tipo } = phone;

          const { idTipoTelefono } = await TipoTelefono.findOne({
            where: { tipo },
          });

          if (idTipoTelefono) {
            const newTelefono = await Telefono.create(
              {
                idEntidad,
                telefono,
                idTipoTelefono,
              },
              { transaction }
            );

            if (!newTelefono) {
              notError = false;
            }
          } else {
            notError = false;
          }
        })
      );

      return notError;
    } catch (error) {
      return false;
    }
  },
  // [{ idTelefono: "qwertfger", telefono: 8096125752, tipo:'casa'}]
  async updateTelefono({ idEntidad, telefonos }) {
    let notError = true;
    try {
      await Promise.all(
        await telefonos.map(async (phone) => {
          const { telefono, tipo, idTelefono } = phone;

          const { idTipoTelefono } = await TipoTelefono.findOne({
            where: { tipo },
          });

          if (idTipoTelefono) {
            const newTelefono = await Telefono.update(
              {
                idEntidad,
                telefono,
                idTipoTelefono,
              },
              { where: { idTelefono } }
            );

            if (!newTelefono) {
              notError = false;
            }
          } else {
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
