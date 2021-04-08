const { Pariente } = require('../../db/models/relaciones');
const { createIdentidad } = require('./identidad');
const { createPersona } = require('./persona');

module.exports = {
  async createPariente({
    apellido,
    sexo,
    idCliente,
    identidades,
    idPersona: idPersonaCreate = '',
    nombre,
    nacimiento,
    telefonos,
    correos,
    direcciones,
    statusEntidad = false,
    transaction,
  }) {
    let data = {};

    try {
      if (idPersonaCreate) {
        data = await Pariente.create({
          idPersona: idPersonaCreate,
          idCliente,
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
          transaction,
        });

        if (!status) {
          return {
            error: true,
            message,
          };
        }

        const parienteExit = await Pariente.findOne({
          where: { idPersona },
        });

        if (parienteExit) {
          return {
            error: true,
            message: 'Este Pariente ya esta registrado.',
          };
        }

        data = await Pariente.create({
          idPersona,
          idCliente,
        });
      }

      if (identidades) {
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

        await data.setParienteIdentidad(idIdentidad);
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
