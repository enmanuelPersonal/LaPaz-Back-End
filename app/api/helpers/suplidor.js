const { Cliente, Suplidor } = require('../../db/models/relaciones');
const { createIdentidad } = require('./identidad');
const { createPersona } = require('./persona');

module.exports = {
  async createSuplidor({
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
        data = await Suplidor.create({
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
          transaction,
        });
        if (!status) {
          return {
            error: true,
            message,
          };
        }

        const suplidorExist = await Suplidor.findOne({
          where: { idPersona },
        });

        if (suplidorExist) {
          return {
            error: true,
            message: 'Este Suplidor ya esta registrado.',
          };
        }

        data = await Suplidor.create({
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
