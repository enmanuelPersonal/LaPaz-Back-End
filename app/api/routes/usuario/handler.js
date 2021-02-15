const { sequelize } = require('../../../db/config/database');
const { Usuario, TipoUsuario } = require('../../../db/models/relaciones');
const { createEntidad } = require('../../helpers/entidad');
// {
//   "usuario": "EnmanuelEstrella22",
//     "password": "12345678",
//     "idTipoUsuario": "2c961280-b2b5-4188-aa01-8e47a524c362",
//     "nombre" : "Enmanuel",
//     "nacimiento" : "12/22/1999",
//     "telefonos" : [{"telefono":"8096125752", "tipo":"0083ccc0-8aa2-4367-b16e-cdebbc3736e8"}, {"telefono":"8492777475", "tipo":"b079fbf7-09f4-4a80-b0c9-3750114a74ae"}],
//     "correos" : ["e@gmail.com", "a@gmail.com"],
//     "direcciones" : [{"idPais": "0377c568-c139-4408-9b40-ca043f9372ba", "idRegion":"83bce05b-503b-4de6-8de8-f571bdde1c25", "idCiudad": "a004fb12-eb41-4931-9a28-61de0022b7f8", "idMunicipio":"31c963fd-9fcb-4133-9e21-ce2e75f97907", "idSector":"f7471452-28ae-4a1d-be6d-be5674d1046c", "idCalle":"1f61dc60-bf54-4753-9211-1f59ebae1360", "idCasa":"ab8f9f4f-6347-4756-b278-415c1b14a0ad"}]
// }
module.exports = {
  async addUser(req, res) {
    const {
      usuario,
      password,
      idTipoUsuario = '',
      idEntidad = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
    } = req.body;
    let data, getIdTipoUsuario;

    try {
      await sequelize.transaction(async (transaction) => {
        const userExist = await Usuario.findOne({
          where: { usuario },
        });

        if (userExist) {
          return res.status(409).send({
            data: userExist,
            message: 'Este Usuario ya esta registrado.',
          });
        }

        if (!idTipoUsuario) {
          getIdTipoUsuario = await TipoUsuario.findOne({
            where: { tipo: 'cliente corriente' },
          });
        }

        if (idEntidad) {
          data = await Usuario.create(
            {
              usuario,
              password,
              idEntidad,
              idTipoUsuario,
            },
            { transaction }
          );
        } else {
          const { status, idEntidad } = await createEntidad({
            nombre,
            nacimiento,
            telefonos,
            correos,
            direcciones,
            transaction,
          });

          if (!status) {
            return res.status(409).send(idEntidad);
          }

          data = await Usuario.create(
            {
              usuario,
              password,
              idEntidad,
              idTipoUsuario: idTipoUsuario || getIdTipoUsuario.idTipoUsuario,
            },
            { transaction }
          );
        }
        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
