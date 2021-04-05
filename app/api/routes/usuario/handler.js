const { sequelize } = require('../../../db/config/database');
const { Usuario, TipoUsuario } = require('../../../db/models/relaciones');
const { createEntidad } = require('../../helpers/entidad');
const { getNameDireccion } = require('../../helpers/getNamesDireccion');
const { personUserParams } = require('../../utils/constant');
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
  async getUser(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const users = await Usuario.findAll({
        include: [personUserParams, { model: TipoUsuario, as: 'TipoUsuario' }],
      });

      if (users.length) {
        await Promise.all(
          users.map(async (user) => {
            let getNameDireccions = {};
            const {
              idUsuario,
              usuario,
              idEntidad,
              idTipoUsuario,
              TipoUsuario: { tipo },
              EntidadUsuario: {
                nombre,
                nacimiento,
                EntidadTelefono,
                EntidadDireccion,
              },
            } = user;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            if (EntidadDireccion.length) {
              getNameDireccions = await getNameDireccion(EntidadDireccion[0]);
            }

            return parseData.push({
              idUsuario,
              usuario,
              idEntidad,
              idTipoUsuario,
              tipo,
              nombre,
              nacimiento,
              telefonos,
              direcciones: EntidadDireccion,
              ...getNameDireccions,
            });
          })
        );
      }
      if (parseData.length > limit) {
        parseData = parseData.slice(0, limit + 1);
      }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async updateUser(req, res) {
    const { idUsuario, usuario, password, idTipoUsuario, idEntidad } = req.body;
    let data = {};

    try {
      const userExist = await Usuario.findOne({
        where: { idUsuario },
      });

      if (!userExist) {
        return res.status(409).send({
          data: userExist,
          message: 'Este Usuario no existe.',
        });
      }

      if (!idTipoUsuario) {
        return res.status(409).send({
          data: idTipoUsuario,
          message: 'El tipo de Usuario debe ser valido.',
        });
      }

      data = await Usuario.update(
        {
          usuario,
          password,
          idEntidad,
          idTipoUsuario,
        },
        { where: { idUsuario } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteUser(req, res) {
    const { idUsuario } = req.body;
console.log("object", idUsuario);
    try {
      await Usuario.destroy({ where: { idUsuario } });

      return res.status(201).send({ data: '1' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
