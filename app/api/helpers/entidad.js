const { Entidad } = require('../../db/models/relaciones');
const { createCorreo } = require('./correo');
const { createDireccion } = require('./direccion/direccion');
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
        console.log('ENtro en direccion');
        const direccionesIds = await createDireccion({
          direcciones,
        });

        if (!direccionesIds) {
          return {
            status: false,
            message: 'Direcciones incorrectas',
          };
        }
        console.log(direccionesIds, newEntidad);
        await newEntidad.setEntidadDireccion(direccionesIds);
        console.log('Despues del vs');
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
