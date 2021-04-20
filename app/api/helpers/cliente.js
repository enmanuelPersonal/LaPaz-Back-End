const { Cliente } = require('../../db/models/relaciones');
const { createIdentidad } = require('./identidad');
const { createPersona } = require('./persona');

module.exports = {
  async createCliente({
    apellido,
    sexo,
    identidades,
    idPersona: idPersonaCreate = '',
    nombre,
    nacimiento,
    telefonos,
    correos,
    direcciones,
    statusEntidad = false,
    getIdEntidad = '',
    transaction,
  }) {
    let data = {};

    try {
      const {
        status: statusE,
        idIdentidad,
        message: messageE,
      } = await createIdentidad({
        identidades,
      });

      if (!statusE) {
        return {
          error: true,
          message: messageE,
        };
      }

      if (idPersonaCreate) {
        data = await Cliente.create({
          idPersona: idPersonaCreate,
          idIdentidad,
        });
      } else {
        const { status, idPersona, message } = await createPersona({
          nombre,
          nacimiento,
          telefonos,
          correos,
          direcciones,
          apellido,
          sexo,
          statusEntidad,
          getIdEntidad,
          transaction,
        });
        if (!status) {
          return {
            error: true,
            message,
          };
        }

        const clientExist = await Cliente.findOne({
          where: { idPersona },
        });

        if (clientExist) {
          return {
            error: true,
            message: 'Este Cliente ya esta registrado.',
          };
        }

        data = await Cliente.create({
          idPersona,
          idIdentidad,
        });
      }

      return {
        error: false,
        data,
      };
    } catch (error) {
      return true;
    }
  },
};
