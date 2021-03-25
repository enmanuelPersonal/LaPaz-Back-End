const { Identidad } = require('../../db/models/relaciones');
// {identidad:"40210806465", "idTipoIdentidad" : "217851e6-abba-4356-8861-e534eca6de5d"}
module.exports = {
  async createIdentidad({ identidades: { identidad, idTipoIdentidad } }) {
    try {
      const newIdentidad = await Identidad.create({
        idTipoIdentidad,
        serie: identidad,
      });

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
        message: 'No se pudo crear la identidad, ya existe.',
      };
    }
  },
  // {identidad:"40210806465", "idTipoIdentidad" : "217851e6-abba-4356-8861-e534eca6de5d"}, idIdentidad: "1234rtgertg"
  async updateIdentidad({
    identidades: { identidad, idTipoIdentidad },
    idIdentidad,
  }) {
    try {
      const updateIdentidad = await Identidad.update(
        {
          idTipoIdentidad,
          serie: identidad,
        },
        { where: { idIdentidad } }
      );

      if (!updateIdentidad) {
        return {
          status: false,
          message: 'Esa identidad no existe',
        };
      }

      return {
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: `No se pudo actualizar la identidad ${error}`,
      };
    }
  },
};
