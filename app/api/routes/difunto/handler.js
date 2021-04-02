const { sequelize } = require('../../../db/config/database');
const {
  Identidad,
  Pariente,
  Cliente,
  Persona,
  Difunto,
  Entidad,
} = require('../../../db/models/relaciones');
const { getNameDireccion } = require('../../helpers/getNamesDireccion');
const {
  personDeceasedParams,
  clientDeceasedParams,
} = require('../../utils/constant');

// {
//   "idCliente": "6f8c0244-b335-4ef7-8da8-2102d6f1f122",
//   "idPersona": "df339f3a-d80b-4ca3-9250-b7ca26fcfd4c",
//   "urlActa": "/img/acta1",
// }

module.exports = {
  async addDeceased(req, res) {
    const { idCliente = '', idPersona = '', urlActa = '' } = req.body;
    let data = {};

    try {
      await sequelize.transaction(async (transaction) => {
        const clientExit = await Cliente.findOne({
          where: { idCliente },
        });

        if (!clientExit) {
          return res.status(409).send({ message: 'Este Cliente no existe' });
        }

        const personExit = await Persona.findOne({
          where: { idPersona },
        });

        if (!personExit) {
          return res.status(409).send({ message: 'Este Persona no existe' });
        }

        data = await Difunto.create({
          idPersona,
          idCliente,
          actaDef: urlActa,
        });

        await Persona.update(
          {
            status: false,
          },
          { where: { idPersona } }
        );

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getDeceased(req, res) {
    const { limit = 10 } = req.params;
    let parseData = [];

    try {
      const deceaseds = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
        order: [['updatedAt', 'DESC']],
      });

      if (deceaseds.length) {
        await Promise.all(
          await deceaseds.map(async (deceased) => {
            if (!deceased.DifuntoPersona) {
              return;
            }

            const {
              idDifunto,
              idCliente,
              idPersona,
              DifuntoPersona: {
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
              DifuntoCliente: {
                ClientePersona: {
                  apellido: appellidoCliente,
                  EntidadPersona: { nombre: nombreCliente },
                },
              },
            } = deceased;

            const telefonos = EntidadTelefono.map(
              ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
                idTelefono,
                telefono,
                tipo,
              })
            );

            getNameDireccions = await getNameDireccion(EntidadDireccion[0]);

            return parseData.push({
              idDifunto,
              idCliente,
              idPersona,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              nombreCliente,
              appellidoCliente,
              personStatus,
              entidadStatus,
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
  async getDeceasedByIdentidad(req, res) {
    const { serie } = req.params;
    let getPerson;

    try {
      const { idPersona } = await Pariente.findOne({
        include: [
          {
            model: Identidad,
            as: 'ParienteIdentidad',
            where: {
              serie,
            },
          },
        ],
      });

      getPerson = idPersona;
      if (!getPerson) {
        const { idPersona } = await Cliente.findOne({
          include: [
            {
              model: Identidad,
              as: 'ClienteIdentidad',
              where: {
                serie,
              },
            },
          ],
        });
        getPerson = idPersona;
      }

      if (!getPerson) {
        return res.status(409).send({ message: 'Este Difunto no existe' });
      }

      const deceased = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
        where: {
          idPersona: getPerson,
        },
      });

      return res.status(200).send({ data: deceased });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getDeceasedByClient(req, res) {
    const { idCliente } = req.params;
    let parseData = [];
    let getNameDireccions = {};

    try {
      const deceased = await Difunto.findAll({
        include: [personDeceasedParams, clientDeceasedParams],
        where: {
          idCliente,
        },
      });

      if (deceased.length) {
        parseData = deceased.map(
          ({
            idDifunto,
            idCliente,
            idPersona,
            DifuntoPersona: {
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
            DifuntoCliente: {
              ClientePersona: {
                apellido: appellidoCliente,
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

            return {
              idDifunto,
              idCliente,
              idPersona,
              idEntidad,
              nombre,
              apellido,
              nacimiento,
              sexo,
              nombreCliente,
              appellidoCliente,
              personStatus,
              entidadStatus,
              correos: EntidadCorreo,
              telefonos,
              direcciones: EntidadDireccion,
              ...getNameDireccions,
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
  // {
  //   "idCliente": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "idDifunto": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "idPersona": "79a5dacf-d567-4f68-ae12-384277b189b8",
  //   "urlActa": "/img/acta1",
  //   "status": "true",
  // }
  async updateDeceased(req, res) {
    const {
      idDifunto = '',
      idCliente = '',
      idPersona = '',
      urlActa = '',
      status = false,
    } = req.body;
    let data = {};

    try {
      const getDeceased = await Difunto.findOne({
        where: { idDifunto },
      });

      if (!getDeceased) {
        return res.status(409).send({ message: 'Este Difunto no existe' });
      }

      data = await Difunto.update(
        {
          idPersona,
          idCliente,
          actaDef: urlActa,
        },
        { where: { idDifunto } }
      );

      await Persona.update(
        {
          status,
        },
        { where: { idPersona } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteDeceased(req, res) {
    const { idEntidad } = req.body;

    try {
      const getDeceased = await Entidad.findOne({
        where: { idEntidad },
      });

      if (!getDeceased) {
        return res.status(409).send({ message: 'Este Difunto no existe' });
      }

      const data = await Entidad.update(
        {
          status: true,
        },
        { where: { idEntidad } }
      );

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
