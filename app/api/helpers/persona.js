const { Persona, Sexo } = require('../../db/models/relaciones');
const { createEntidad, updateEntidad } = require('./entidad');

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
    statusEntidad = true,
  }) {
    try {
      const { status, idEntidad, message } = await createEntidad({
        nombre,
        nacimiento,
        telefonos,
        correos,
        direcciones,
        statusEntidad,
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
          message: 'Esa persona ya existe',
        };
      }

      return {
        status: true,
        idPersona: newPerson.idPersona,
        idEntidad,
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo crear la Persona',
      };
    }
  },

  async updatePersona({
    nombre,
    nacimiento,
    telefonos,
    correos,
    direcciones,
    apellido,
    sexo,
    idEntidad,
    idPersona,
  }) {
    try {
      const { status, message } = await updateEntidad({
        nombre,
        nacimiento,
        telefonos,
        correos,
        direcciones,
        idEntidad,
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

      const updatePerson = await Persona.update(
        {
          apellido,
          idSexo: getSexo.idSexo,
          idEntidad,
        },
        { where: { idPersona } }
      );

      if (!updatePerson) {
        return {
          status: false,
          message: 'Esa persona no existe',
        };
      }

      return {
        status: true,
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo actualizar la Persona',
      };
    }
  },
};
