const { sequelize } = require('../../../db/config/database');
const {
  Suscripcion,
  TipoPlan,
  HistorialSuscripcion,
  Entidad,
} = require('../../../db/models/relaciones');
const { createCliente } = require('../../helpers/cliente');
const { createPariente } = require('../../helpers/pariente');
const { clientSuscripcionParams } = require('../../utils/constant');
const { getParientes } = require('./getParientes');

// {
//   "client": {
//   "nombre" : "Jose Enmanuel",
//   "apellido" : "Estrella Estrella",
//   "sexo" : "M",
//   "identidades": {"identidad":"40310806456", "idTipoIdentidad" : "f85a85aa-a6da-43e8-9746-f1a35a8fd504"},
//   "correos" : ["e122221nma@gmail.com"],
//   "nacimiento" : "12/22/1999"
// },
// "telefonos" : [{"telefono":"8096125752", "tipo":"casa"}, {"telefono":"8492777475", "tipo":"celular"}],
// "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}],
// "parientes": [
//   {
//     "nombre" : "Elian Jose",
//     "apellido" : "Estrella Estrella",
//     "sexo" : "M",
//     "nacimiento" : "10/03/2015"
//   },
//    {
//     "nombre" : "Eliana Maria",
//     "apellido" : "Estrella Estrella",
//     "sexo" : "M",
//     "identidades": {"identidad":"40210805460", "idTipoIdentidad" : "192e195e-9027-423a-8da9-a3b22cb8805d"},
//     "nacimiento" : "02/16/2007"
//   }
// ],
// "idTipoPlan": "ded27e93-0b9c-4497-8a94-c881561f4b21",
// "monto": 3000
// "idUsuario": "2ert2qwertgwer"
// }

// {
//   "idClient": "37f33547-b153-4655-a04c-a47aa0c9f49a",
//   "idTipoPlan": "6c88201e-9c75-467c-acbe-d35855162926",
//   "monto": 1500
// }

module.exports = {
  async addSuscripcion(req, res) {
    const {
      client,
      parientes = [],
      idClient = '',
      direcciones = [],
      telefonos = [],
      idTipoPlan,
      monto,
      idUsuario,
      status = 'Proceso',
    } = req.body;
    let getData = {},
      errorParientes = [];

    try {
      await sequelize.transaction(async (transaction) => {
        if (idClient) {
          getData = await Suscripcion.create({
            idCliente: idClient,
            idTipoPlan,
            monto,
            status,
          });

          await HistorialSuscripcion.create({
            idCliente: idClient,
            idUsuario,
            idTipoPlan,
            idSuscripcion: getData.idSuscripcion,
          });
        } else {
          const { data, error, message } = await createCliente({
            ...client,
            telefonos,
            direcciones,
            transaction,
          });

          if (error) {
            return res.status(409).send(message);
          }

          const { idCliente } = data;

          if (parientes.length) {
            await Promise.all(
              await parientes.map(async (pariente, i) => {
                const getTelefono = pariente.telefonos || telefonos;

                const { error, message } = await createPariente({
                  ...pariente,
                  telefonos: getTelefono,
                  direcciones,
                  idCliente,
                  transaction,
                });

                if (error) {
                  return errorParientes.push(message);
                }

                return {};
              })
            );
          }
          if (!errorParientes.length) {
            getData = await Suscripcion.create({
              idCliente,
              idTipoPlan,
              monto,
              status,
            });

            await HistorialSuscripcion.create({
              idCliente,
              idUsuario,
              idTipoPlan,
              idSuscripcion: getData.idSuscripcion,
            });
          } else {
            return res.status(409).send(errorParientes);
          }
        }

        return res.status(201).send({ data: getData });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getSuscripciones(req, res) {
    const { limit = 10 } = req.params;
    let parseData = [];
    try {
      const suscripciones = await Suscripcion.findAll({
        include: [
          clientSuscripcionParams,
          { model: TipoPlan, as: 'SuscripcionTipoPlan' },
        ],
        order: [['updatedAt', 'DESC']],
      });

      if (suscripciones.length) {
        await Promise.all(
          await suscripciones.map(async (suscripcion) => {
            let getAllParientes = [];
            if (!suscripcion.SuscripcionCliente.ClientePersona) {
              return;
            }

            const {
              idSuscripcion,
              monto,
              status: statusSuscripcion,
              createdAt: fecha,
              idCliente,
              idTipoPlan,
              SuscripcionCliente: {
                ClientePersona: {
                  apellido,
                  status: personStatus,
                  idEntidad,
                  EntidadPersona: { nombre, nacimiento, status: entidadStatus },
                  SexoPersona: { sexo },
                },
                ClienteIdentidad: {
                  serie,
                  TipoIdentidad: { tipo: tipoIdentidad },
                },
              },
              SuscripcionTipoPlan: { tipo, monto: cuotas, status: statusPlan },
            } = suscripcion;

            const { error, parientes } = await getParientes({ idCliente });

            if (!error) {
              getAllParientes = parientes;
            }

            return parseData.push({
              idSuscripcion,
              monto,
              statusSuscripcion,
              fecha,
              idCliente,
              idTipoPlan,
              apellido,
              personStatus,
              idEntidad,
              nombre,
              nacimiento,
              entidadStatus,
              sexo,
              tipoPlan: tipo,
              cuotas,
              statusPlan,
              identidades: { identidad: serie, tipo: tipoIdentidad },
              parientes: getAllParientes,
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
  async getSuscripcionByClient(req, res) {
    const { idCliente } = req.params;
    let parseData = [];

    try {
      const suscripciones = await Suscripcion.findAll({
        include: [
          clientSuscripcionParams,
          { model: TipoPlan, as: 'SuscripcionTipoPlan' },
        ],
        where: { idCliente },
        order: [['updatedAt', 'DESC']],
      });
      if (suscripciones.length) {
        parseData = suscripciones.map((suscripcion) => {
          if (!suscripcion.SuscripcionCliente.ClientePersona) {
            return;
          }

          const {
            idSuscripcion,
            monto,
            status: statusSuscripcion,
            createdAt: fecha,
            idCliente,
            idTipoPlan,
            SuscripcionCliente: {
              ClientePersona: {
                apellido,
                status: personStatus,
                idEntidad,
                EntidadPersona: { nombre, nacimiento, status: entidadStatus },
                SexoPersona: { sexo },
              },
              ClienteIdentidad: {
                serie,
                TipoIdentidad: { tipo: tipoIdentidad },
              },
            },
            SuscripcionTipoPlan: { tipo, monto: cuotas, status: statusPlan },
          } = suscripcion;

          return {
            idSuscripcion,
            monto,
            statusSuscripcion,
            fecha,
            idCliente,
            idTipoPlan,
            apellido,
            personStatus,
            idEntidad,
            nombre,
            nacimiento,
            entidadStatus,
            sexo,
            tipoPlan: tipo,
            cuotas,
            statusPlan,
            identidades: { identidad: serie, tipo: tipoIdentidad },
          };
        });
      }

      return res.status(200).send({ data: { ...parseData[0] } });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idCliente": "73cf1508-1a00-4d33-bb25-3b0af1864186",
  //   "idSuscripcion": "60e3102b-bc12-40fd-b4a5-6c4e71a132e1",
  //   "idUsuario": "6efb5963-03a2-449d-a66b-97144beba3ed",
  //   "idTipoPlan": "42ff2a51-bf42-4fcb-9d8f-166462121fd7",
  //   "monto": 200,
  //   "idParientes": ["9ee0e212-8772-436c-9a2c-79e5c9dfe791","0adce36a-55c2-4168-a95f-c04cf27df47c"],
  //   "idClienteEntidad": "fc683b58-8b14-4368-a170-53b6e35b341c",
  // }
  async updateSuscripcion(req, res) {
    const {
      idSuscripcion,
      idCliente,
      idTipoPlan,
      monto,
      idUsuario,
      status = 'Proceso',
      idParientes = [],
      idClienteEntidad = '',
    } = req.body;
    let data = {};

    try {
      const getSuscripcion = await Suscripcion.findOne({
        where: { idSuscripcion },
      });

      if (!getSuscripcion) {
        return res.status(409).send({ message: 'Esta Suscripcion no existe' });
      }

      if (status === 'Aceptada') {
        await Entidad.update(
          {
            status: true,
          },
          { where: { idEntidad: idClienteEntidad } }
        );

        await Promise.all(
          await idParientes.map(async (idEntidad) => {
            await Entidad.update(
              {
                status: true,
              },
              { where: { idEntidad } }
            );
            return;
          })
        );
      } else {
        await Entidad.update(
          {
            status: false,
          },
          { where: { idEntidad: idClienteEntidad } }
        );

        await Promise.all(
          await idParientes.map(async (idEntidad) => {
            await Entidad.update(
              {
                status: false,
              },
              { where: { idEntidad } }
            );
            return;
          })
        );
      }

      data = await Suscripcion.update(
        {
          idCliente,
          idTipoPlan,
          monto,
          status,
        },
        { where: { idSuscripcion } }
      );

      await HistorialSuscripcion.create({
        idCliente,
        idUsuario,
        idTipoPlan,
        idSuscripcion,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteSuscripcion(req, res) {
    const {
      idSuscripcion,
      idParientes = [],
      idClienteEntidad = '',
      idUsuario = '',
    } = req.body;
    let data = {};

    try {
      const getSuscripcion = await Suscripcion.findOne({
        where: { idSuscripcion },
      });

      if (!getSuscripcion) {
        return res.status(409).send({ message: 'Esta Suscripcion no existe' });
      }

      await Entidad.update(
        {
          status: false,
        },
        { where: { idEntidad: idClienteEntidad } }
      );

      await Promise.all(
        await idParientes.map(async (idEntidad) => {
          await Entidad.update(
            {
              status: false,
            },
            { where: { idEntidad } }
          );
          return;
        })
      );

      data = await Suscripcion.update(
        {
          status: 'Cancelada',
        },
        { where: { idSuscripcion } }
      );

      await HistorialSuscripcion.create({
        idCliente: getSuscripcion.idCliente,
        idUsuario,
        idTipoPlan: getSuscripcion.idTipoPlan,
        idSuscripcion,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
