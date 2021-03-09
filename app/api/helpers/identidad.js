const { Identidad } = require('../../db/models/relaciones');
// {identidad:"40210806465", "idTipoIdentidad" : "217851e6-abba-4356-8861-e534eca6de5d"}
module.exports = {
  async createIdentidad({
     identidades: { identidad, idTipoIdentidad }
  }) {

    try {
      const newIdentidad = await Identidad.create(
        {
          idTipoIdentidad,
          serie: identidad,
        }
      );

      if (!newIdentidad) {
        return {
          status: false,
          message: 'Esa identidad ya existe',
        };
      }

      return {
        status: true,
        idIdentidad: newIdentidad.idIdentidad,
      };
    } catch (error) {
     return {
          status: false,
          message: 'No se pudo crear la identidad',
        };
    }
  },
};
