const { Entidad } = require('../../db/models/relaciones');
const { createCorreo, updateCorreo } = require('./correo');
const { createDireccion, updateDireccion } = require('./direccion/direccion');
const { createTelefono, updateTelefono } = require('./telefono');

module.exports = {
  async createEntidad({
    nombre,
    nacimiento,
    telefonos = [],
    correos = [],
    direcciones = [],
    statusEntidad = true,
    getIdEntidad,
    transaction,
  }) {
    let idEntidad = '';
    try {
      if (getIdEntidad) {
        const newEntidad = await Entidad.create({
          nombre,
          nacimiento,
          status: statusEntidad,
        });

        if (!newEntidad) {
          return {
            status: false,
            message: 'Esa entidad ya existe',
          };
        }
        idEntidad = newEntidad.idEntidad;
      } else {
        idEntidad = getIdEntidad;
      }

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
        status: true,
        idEntidad: newEntidad.idEntidad,
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo crear la Entidad',
      };
    }
  },
  async updateEntidad({
    nombre,
    nacimiento,
    telefonos = [],
    correos = [],
    direcciones = [],
    idEntidad,
  }) {
    try {
      const updateEntidad = await Entidad.update(
        {
          nombre,
          nacimiento,
        },
        { where: { idEntidad } }
      );

      const getEntidad = await Entidad.findOne({
        where: { idEntidad },
      });

      if (!updateEntidad) {
        return {
          status: false,
          message: 'Esa entidad no existe',
        };
      }

      if (telefonos.length) {
        const telefono = await updateTelefono({
          idEntidad,
          telefonos,
        });

        if (!telefono) {
          return {
            status: false,
            message: 'Telefonos incorrectos',
          };
        }
      }

      if (correos.length) {
        const correo = await updateCorreo({ idEntidad, correos });

        if (!correo) {
          return {
            status: false,
            message: 'Correos incorrectos',
          };
        }
      }

      if (direcciones.length) {
        const direccionesIds = await updateDireccion({
          direcciones,
        });

        if (!direccionesIds) {
          return {
            status: false,
            message: 'Direcciones incorrectas',
          };
        }
        await getEntidad.setEntidadDireccion(direccionesIds);
      }

      return {
        status: true,
        idEntidad: getEntidad.idEntidad,
      };
    } catch (error) {
      return {
        status: false,
        message: 'No se pudo actualizar la Entidad',
      };
    }
  },
};
