const { Op } = require('sequelize');
const { sequelize } = require('../../../db/config/database');
const {
  Identidad,
  Cliente,
  TipoIdentidad,
  Entidad,
} = require('../../../db/models/relaciones');
const { createCliente } = require('../../helpers/cliente');
const { getNameDireccion } = require('../../helpers/getNamesDireccion');
const { updateIdentidad } = require('../../helpers/identidad');
const { updatePersona } = require('../../helpers/persona');
const {
  personClientParams,
  personWhereClientParams,
} = require('../../utils/constant');

// {
//   "nombre" : "Jose Enmanuel",
//   "apellido" : "Estrella Estrella",
//   "sexo" : "M",
//   "identidades": {"identidad":"40210806465", "idTipoIdentidad" : "2c3bd59c-c58f-4795-8dd5-bba9034984d4"},
//   "nacimiento" : "12/22/1999",
//  "telefonos" : [{"telefono":"8096125752", "tipo":"casa"}, {"telefono":"8492777475", "tipo":"celular"}],
//   "correos" : ["e@gmail.com", "a@gmail.com"],
//   "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
// }

module.exports = {
  async addClient(req, res) {
    const {
      apellido = '',
      sexo = '',
      identidades = {},
      idPersona: idPersonaCreate = '',
      nombre = '',
      nacimiento = '',
      telefonos = [],
      correos = [],
      direcciones = [],
      statusEntidad = false,
    } = req.body;

    try {
      await sequelize.transaction(async (transaction) => {
        const { data, error, message } = await createCliente({
          apellido,
          sexo,
          identidades,
          idPersona: idPersonaCreate,
          nombre,
          nacimiento,
          telefonos,
          correos,
          direcciones,
          statusEntidad,
          transaction,
        });

        if (error) {
          return res.status(409).send(message);
        }

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getClients(req, res) {
    const { limit = 10 } = req.params;
    let parseData = [];
    try {
      const clients = await Cliente.findAll({
        include: [
          personClientParams,
          {
            model: Identidad,
            as: 'ClienteIdentidad',
            attributes: ['serie'],
            include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
      if (clients.length) {
        await Promise.all(
          await clients.map(async (client) => {
            if (!client.ClientePersona) {
              return;
            }

            const {
              idCliente,
              idPersona,
              idIdentidad,
              ClientePersona: {
                apellido,
                status: personStatus,
                idEntidad,
                EntidadPersona: {
                  nombre,
                  nacimiento,
                  status: entidadStatus,
                  EntidadCorreo,
                  EntidadTelefono,
                  EntidadDireccion,
                },
                SexoPersona: { sexo },
              },
              ClienteIdentidad: {
                serie,
                TipoIdentidad: { idTipoIdentidad },
              },
            } = client;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );
            getNameDireccions = await getNameDireccion(EntidadDireccion[0]);

            return parseData.push({
              idCliente,
              idPersona,
              idIdentidad,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              personStatus,
              entidadStatus,
              identidades: { serie, idTipoIdentidad },
              correos: EntidadCorreo,
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

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getClientsByIdentidad(req, res) {
    const { finder } = req.params;
    const identifier = `%${finder}%`;
    let parseData = [];
    let getNameDireccions = {};
    let where = {};

    if (!isNaN(Number(finder))) {
      where = {
        serie: { [Op.iLike]: identifier },
      };
    }

    try {
      const client = await Cliente.findAll({
        include: [
          personClientParams,
          {
            model: Identidad,
            as: 'ClienteIdentidad',
            attributes: ['serie'],
            include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
            where,
          },
        ],
      });

      if (client.length) {
        parseData = client.map((client) => {
          if (!client.ClientePersona) {
            return;
          }

          const {
            idCliente,
            idPersona,
            idIdentidad,
            ClientePersona: {
              apellido,
              status: personStatus,
              idEntidad,
              EntidadPersona: {
                nombre,
                nacimiento,
                status: entidadStatus,
                EntidadCorreo,
                EntidadTelefono,
                EntidadDireccion,
              },
              SexoPersona: { sexo },
            },
            ClienteIdentidad: {
              serie,
              TipoIdentidad: { idTipoIdentidad },
            },
          } = client;

          const telefonos = EntidadTelefono.map(
            ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
              idTelefono,
              telefono,
              tipo,
            })
          );

          return {
            idCliente,
            idPersona,
            idIdentidad,
            idEntidad,
            nombre,
            apellido,
            nacimiento,
            sexo,
            personStatus,
            entidadStatus,
            identidades: { serie, idTipoIdentidad },
            correos: EntidadCorreo,
            telefonos,
            direcciones: EntidadDireccion,
          };
        });

        if (parseData[0]) {
          const { direcciones } = parseData[0];
          getNameDireccions = await getNameDireccion(direcciones[0]);
        }
      }

      return res
        .status(200)
        .send({ data: { ...parseData[0], ...getNameDireccions } });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "nombre" : "Enmanuel",
  //   "apellido" : "Estrella",
  //   "sexo" : "M",
  //   "idEntidad": "7621c242-14cc-4a56-af71-5751216e5bee",
  //   "idPersona": "8d32aca6-5184-40bb-b45f-24f2043ab2cf",
  //   "identidades": {"identidad":"40210806461", "idTipoIdentidad" : "c3ab116b-1373-442c-9d28-9b3b15467b6f"},
  //   "idIdentidad": "33cf4d76-da80-44a9-a1a7-3ca70a19f824",
  //   "idCliente": "b0bb73ad-38b7-4c42-b128-0f2009b5069b",
  //   "nacimiento" : "12/22/1990",
  //  "telefonos" : [{"idTelefono": "8b1b9487-34aa-4186-b62a-c6478cb63f89","telefono":"8888888888", "tipo":"casa"}, {"idTelefono": "3b3df1f6-1fdc-4849-8ecc-db1e35394cc2","telefono":"8488888888", "tipo":"celular"}],
  //   "correos" : [{"idCorreo":"dd648635-256e-44f7-a95f-b380f89badb9","correo":"enmanuel@gmail.com"}, {"idCorreo":"5af0e621-5ca0-4606-8d9a-723fa16f2706","correo":"alay@gmail.com"}],
  //   "direcciones" : [{"idDireccion":"4a447012-1f8a-4160-9335-362cc5abb6aa", "pais": "Republica Dominicana", "region":"Norte", "ciudad": "Jarabacoa", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
  // }
  async updateClient(req, res) {
    const {
      apellido = '',
      sexo = '',
      idCliente = '',
      identidades = {},
      idIdentidad,
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
      const getClient = await Cliente.findOne({
        where: { idCliente },
      });

      if (!getClient) {
        return res.status(409).send({ message: 'Este Cliente no existe' });
      }

      const { status: statusE, message: messageE } = await updateIdentidad({
        identidades,
        idIdentidad,
      });

      if (!statusE) {
        return res.status(409).send(messageE);
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

      data = await Cliente.update(
        {
          idPersona,
          idIdentidad,
        },
        { where: { idCliente } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteClient(req, res) {
    const { idEntidad } = req.body;

    try {
      const getClient = await Entidad.findOne({
        where: { idEntidad },
      });

      if (!getClient) {
        return res.status(409).send({ message: 'Este Cliente no existe' });
      }

      const data = await Entidad.update(
        {
          status: false,
        },
        { where: { idEntidad } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
