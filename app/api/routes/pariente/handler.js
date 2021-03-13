const { sequelize } = require('../../../db/config/database');
const {
  Identidad,
  Pariente,
} = require('../../../db/models/relaciones');
const { createIdentidad, updateIdentidad } = require('../../helpers/identidad');
const { createPersona, updatePersona } = require('../../helpers/persona');
const { personParienteParams, clientParienteParams } = require('../../utils/constant');

// {
//   "nombre" : "Jose Enmanuel",
//   "apellido" : "Estrella Estrella",
//   "sexo" : "M",
//   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
//   "identidades": {"identidad":"40210806465", "idTipoIdentidad" : "2c3bd59c-c58f-4795-8dd5-bba9034984d4"},
//   "nacimiento" : "12/22/1999",
//  "telefonos" : [{"telefono":"8096125752", "tipo":"casa"}, {"telefono":"8492777475", "tipo":"celular"}],
//   "correos" : ["e@gmail.com", "a@gmail.com"],
//   "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
// }

module.exports = {
  async addPariente(req, res) {
    const {
      apellido = '',
      sexo = '',
      idCliente = '',
      identidades = '',
      idPersona: idPersonaCreate = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
    } = req.body;
    let data = {};

    try {
      await sequelize.transaction(async (transaction) => {
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
            transaction,
          });
          if (!status) {
            return res.status(409).send(message);
          }

          const parienteExit = await Pariente.findOne({
            where: { idPersona },
          });

          if (parienteExit) {
            return res.status(409).send({
              data: parienteExit,
              message: 'Este Pariente ya esta registrado.',
            });
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
            return res.status(409).send(messageE);
          }

          await data.setParienteIdentidad(idIdentidad);
        }

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getParientes(req, res) {
    try {
      const parientes = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
          },
          clientParienteParams,
        ],
      });

      return res.status(200).send({ data: parientes });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getParienteByIdentidad(req, res) {
    const { serie } = req.params;

    try {
      const pariente = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            where: {
              serie,
            },
          },
          clientParienteParams,
        ],
      });

      return res.status(200).send({ data: pariente });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getParienteByClient(req, res) {
    const { idCliente } = req.params;

    try {
      const pariente = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
          },
          clientParienteParams,
        ],
        where: {
          idCliente,
        },
      });

      return res.status(200).send({ data: pariente });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "nombre" : "Enmanuel",
  //   "apellido" : "Estrella",
  //   "sexo" : "M",
  //   "idEntidad": "ada8185f-dd60-4594-9cec-f00b143f3962e",
  //   "idPersona": "beddd925-0c30-499a-9a21-a6b5c768363f",
  //   "idPariente": "6e195703-b31f-4b6b-ba64-e3cc1efc5314",
  //   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "identidades": {"identidad":"40210806461", "idTipoIdentidad" : "2c3bd59c-c58f-4795-8dd5-bba9034984d4"},
  //   "idIdentidad": "50ce5bd0-b1ce-4234-b5a5-cf1c9df2cf60",
  //   "nacimiento" : "12/22/1990",
  //  "telefonos" : [{"idTelefono": "8b1b9487-34aa-4186-b62a-c6478cb63f89","telefono":"8888888888", "tipo":"casa"}, {"idTelefono": "3b3df1f6-1fdc-4849-8ecc-db1e35394cc2","telefono":"8488888888", "tipo":"celular"}],
  //   "correos" : [{"idCorreo":"9db0fabc-4dd4-467b-bb8e-90de81522083","correo":"enmanuel@gmail.com"}, {"idCorreo":"62355070-291e-44ee-93bb-f888680ed0d9","correo":"alay@gmail.com"}],
  //   "direcciones" : [{"idDireccion":"f0ba7018-cff2-4226-a9d2-40b33050845c", "pais": "Republica Dominicana", "region":"Norte", "ciudad": "Jarabacoa", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
  // }
  async updatePariente(req, res) {
    const {
      apellido = '',
      sexo = '',
      idPariente = '',
      idCliente = '',
      identidades = '',
      idIdentidad = '',
      idEntidad = '',
      idPersona = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
    } = req.body;
    let data = {};

    try {
      const getPariente = await Pariente.findOne({
        where: { idPariente },
      });

      if (!getPariente) {
        return res.status(409).send({ message: 'Este Pariente no existe' });
      }

      const { status, message } = await updatePersona({
        nombre,
        nacimiento,
        telefonos,
        correos,
        direcciones,
        apellido,
        sexo,
        idEntidad,
        idPersona,
      });
      if (!status) {
        return res.status(409).send(message);
      }

      if (identidades && idIdentidad) {
        const { status: statusE, message: messageE } = await updateIdentidad({
          identidades,
          idIdentidad,
        });

        if (!statusE) {
          return res.status(409).send(messageE);
        }

        await getPariente.setParienteIdentidad(idIdentidad);
      } else {
        const {
          status: statusE,
          idIdentidad,
          message: messageE,
        } = await createIdentidad({
          identidades,
        });

        if (!statusE) {
          return res.status(409).send(messageE);
        }

        await getPariente.setParienteIdentidad(idIdentidad);
      }

      data = await Pariente.update(
        {
          idPersona,
          idCliente,
        },
        { where: { idPariente } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
