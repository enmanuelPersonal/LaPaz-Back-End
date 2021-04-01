const { Pariente, Identidad } = require('../../../db/models/relaciones');
const { personParienteParams } = require('../../utils/constant');

module.exports = {
  async getParientes({ idCliente }) {
    let parseData = [];
    try {
      const parientes = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            attributes: ['serie'],
          },
        ],
        order: [['updatedAt', 'DESC']],
        where: { idCliente },
      });

      if (parientes.length) {
        await Promise.all(
          await parientes.map(async (pariente) => {
            if (!pariente.ParientePersona) {
              return;
            }

            const {
              ParientePersona: {
                apellido,
                EntidadPersona: {
                  idEntidad,
                  nombre,
                  nacimiento,
                  EntidadCorreo,
                  EntidadTelefono,
                },
                SexoPersona: { sexo },
              },
              ParienteIdentidad,
            } = pariente;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            const identidades = ParienteIdentidad.map(({ serie }) => ({
              serie,
            }));

            return parseData.push({
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              identidades,
              correos: EntidadCorreo,
              telefonos,
            });
          })
        );
      }

      return { parientes: parseData, error: false };
    } catch (error) {
      return {
        error: true,
      };
    }
  },
};
