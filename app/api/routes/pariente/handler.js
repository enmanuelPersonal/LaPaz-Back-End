const { sequelize } = require('../../../db/config/database');
const {
  Identidad,
  Pariente,
  TipoIdentidad,
} = require('../../../db/models/relaciones');
const { getNameDireccion } = require('../../helpers/getNamesDireccion');
const { createIdentidad, updateIdentidad } = require('../../helpers/identidad');
const { createPariente } = require('../../helpers/pariente');
const { createPersona, updatePersona } = require('../../helpers/persona');
const {
  personParienteParams,
  clientParienteParams,
} = require('../../utils/constant');

// {
//   "nombre" : "Jose Enmanuel",
//   "apellido" : "Estrella Estrella",
//   "sexo" : "M",
//   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
//   "identidades": {"identidad":"40210806465", "idTipoIdentidad" : "0c9e216a-3330-46bc-a249-cea4c8cd0f04"},
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
      statusEntidad = false,
    } = req.body;

    try {
      await sequelize.transaction(async (transaction) => {
        const { data, error, message } = await createPariente({
          apellido,
          sexo,
          idCliente,
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
  async getParientes(req, res) {
    let parseData = [];

    try {
      const parientes = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            attributes: ['serie'],
            include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
          },
          clientParienteParams,
        ],
        order: [['updatedAt', 'DESC']],
      });
      if (parientes.length) {
        await Promise.all(
          await parientes.map(async (pariente) => {
            if (!pariente.ParientePersona) {
              return;
            }

            const {
              idPariente,
              idCliente,
              idPersona,
              ParientePersona: {
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
              ParienteIdentidad,
              ParienteCliente: {
                ClientePersona: {
                  apellido: apellidoCliente,
                  EntidadPersona: { nombre: nombreCliente },
                },
              },
            } = pariente;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            const identidades = ParienteIdentidad.map(
              ({ serie, TipoIdentidad: { idTipoIdentidad, tipo } }) => ({
                serie,
                idTipoIdentidad,
                tipo,
              })
            );

            getNameDireccions = await getNameDireccion(EntidadDireccion[0]);

            return parseData.push({
              idPariente,
              idCliente,
              idPersona,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              nombreCliente,
              apellidoCliente,
              personStatus,
              entidadStatus,
              identidades: identidades,
              correos: EntidadCorreo,
              telefonos,
              direcciones: EntidadDireccion,
              ...getNameDireccions,
            });
          })
        );
      }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getParienteByIdentidad(req, res) {
    const { serie } = req.params;
    let parseData = [];
    let getNameDireccions = {};

    try {
      const pariente = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            attributes: ['serie'],
            include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
            where: {
              serie,
            },
          },
          clientParienteParams,
        ],
      });

      if (pariente.length) {
        parseData = pariente.map(
          ({
            idPariente,
            idCliente,
            idPersona,
            ParientePersona: {
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
            ParienteIdentidad,
            ParienteCliente: {
              ClientePersona: {
                apellido: apellidoCliente,
                EntidadPersona: { nombre: nombreCliente },
              },
            },
          }) => {
            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            const identidades = ParienteIdentidad.map(
              ({ serie, TipoIdentidad: { idTipoIdentidad, tipo } }) => ({
                serie,
                idTipoIdentidad,
                tipo,
              })
            );

            return {
              idPariente,
              idCliente,
              idPersona,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              nombreCliente,
              apellidoCliente,
              personStatus,
              entidadStatus,
              identidades: identidades,
              correos: EntidadCorreo,
              telefonos,
              direcciones: EntidadDireccion,
            };
          }
        );

        const { direcciones } = parseData[0];
        getNameDireccions = await getNameDireccion(direcciones[0]);
      }

      return res
        .status(200)
        .send({ data: { ...parseData[0], ...getNameDireccions } });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getParienteByClient(req, res) {
    const { idCliente } = req.params;
    let parseData = [];
    let getNameDireccions = {};

    try {
      const parientes = await Pariente.findAll({
        include: [
          personParienteParams,
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            attributes: ['serie'],
            include: [{ model: TipoIdentidad, as: 'TipoIdentidad' }],
          },
          clientParienteParams,
        ],
        where: {
          idCliente,
        },
      });

      if (parientes.length) {
        await Promise.all(
          await parientes.map(async (pariente) => {
            if (!pariente.ParientePersona) {
              return;
            }

            const {
              idPariente,
              idCliente,
              idPersona,
              ParientePersona: {
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
              ParienteIdentidad,
              ParienteCliente: {
                ClientePersona: {
                  apellido: apellidoCliente,
                  EntidadPersona: { nombre: nombreCliente },
                },
              },
            } = pariente;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            const identidades = ParienteIdentidad.map(
              ({ serie, TipoIdentidad: { idTipoIdentidad, tipo } }) => ({
                serie,
                idTipoIdentidad,
                tipo,
              })
            );

            getNameDireccions = await getNameDireccion(EntidadDireccion[0]);

            return parseData.push({
              idPariente,
              idCliente,
              idPersona,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              nombreCliente,
              apellidoCliente,
              personStatus,
              entidadStatus,
              identidades: identidades,
              correos: EntidadCorreo,
              telefonos,
              direcciones: EntidadDireccion,
              ...getNameDireccions,
            });
          })
        );
      }

      return res.status(200).send({ data: parseData });
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
  async deletePariente(req, res) {
    const { idEntidad } = req.body;

    try {
      const getPariente = await Entidad.findOne({
        where: { idEntidad },
      });

      if (!getPariente) {
        return res.status(409).send({ message: 'Este Pariente no existe' });
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
