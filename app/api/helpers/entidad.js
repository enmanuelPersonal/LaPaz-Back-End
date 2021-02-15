const { Entidad } = require('../../db/models/relaciones');
const { createCorreo } = require('./correo');
const { createDireccion } = require('./direccion');
const { createTelefono } = require('./telefono');
// Telefono *
// Correo *
// Direccion * devuelve el arreglo de las direcciones
module.exports = {
  async createEntidad({
    nombre,
    nacimiento,
    telefonos = [],
    correos = [],
    direcciones = [],
    transaction,
  }) {
    try {
      const newEntidad = await Entidad.create(
        {
          nombre,
          nacimiento,
        },
        { transaction }
      );

      if (!newEntidad) {
        return {
          status: false,
          message: 'Esa entidad ya existe',
        };
      }

      const { idEntidad } = newEntidad;

      if (telefonos.length) {
        const telefono = await createTelefono({
          idEntidad,
          telefonos,
          transaction,
        });

        if (!telefono) {
          return {
            status: false,
            message: 'Telefonos incorrectos',
          };
        }
      }

      if (correos.length) {
        const correo = await createCorreo({ idEntidad, correos, transaction });

        if (!correo) {
          return {
            status: false,
            message: 'Correos incorrectos',
          };
        }
      }

      if (direcciones.length) {
        const direccionesIds = await createDireccion({
          direcciones,
          transaction,
        });

        if (!direccionesIds) {
          return {
            status: false,
            message: 'Direcciones incorrectas',
          };
        }

        await newEntidad.setEntidadDireccion(direccionesIds);
      }

      return {
        status: newEntidad.status,
        idEntidad: newEntidad.idEntidad,
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo crear la Entidad',
      };
    }
  },
};
