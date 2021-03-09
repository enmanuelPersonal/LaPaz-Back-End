const { Persona, Sexo } = require('../../db/models/relaciones');
const { createEntidad } = require('./entidad');

module.exports = {
  async createPersona({
    nombre,
    nacimiento,
    telefonos,
    correos,
    direcciones,
    apellido,
    sexo,
    transaction,
  }) {
    try {
      const { status, idEntidad, message } = await createEntidad({
        nombre,
        nacimiento,
        telefonos,
        correos,
        direcciones,
        transaction,
      });

      if (!status) {
        return {
          status: false,
          message,
        };
      }

      const getSexo = await Sexo.findOne({
        where: { sexo },
      });

      if (!getSexo) {
        return {
          status: false,
          message: 'Este sexo no existe',
        };
      }

      const newPerson = await Persona.create({
        apellido,
        idSexo: getSexo.idSexo,
        idEntidad,
      });

      if (!newPerson) {
        return {
          status: false,
          message: 'Esa entidad ya existe',
        };
      }

      return {
        status: true,
        idPersona: newPerson.idPersona,
        idEntidad
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo crear la Persona',
      };
    }
  },
};
