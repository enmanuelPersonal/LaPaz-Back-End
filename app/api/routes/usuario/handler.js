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
//     "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
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
    let data = {},
      getIdTipoUsuario;

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
          const { status, idEntidad, message } = await createEntidad({
            nombre,
            nacimiento,
            telefonos,
            correos,
            direcciones,
            transaction,
          });

          if (!status) {
            return res.status(409).send(message);
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
