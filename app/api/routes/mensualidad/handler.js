const { sequelize } = require('../../../db/config/database');
const {
  Suscripcion,
  TipoPago,
  Mensualidad,
} = require('../../../db/models/relaciones');
const { paymentStripe } = require('../../helpers/pagos/pagos');

// {
// "idTipoPago": "f0ab9552-411b-4506-8824-42201ac90445",
//   "idSuscripcion": "60e3102b-bc12-40fd-b4a5-6c4e71a132e1",
// "meses": 1
// "monto": 1000,
// "amount": 1000 ,
// id: "12345ty345" ,
// "description": "Pago del mes de enero"
// }

module.exports = {
  async addMensualidad(req, res) {
    const {
      idTipoPago,
      idSuscripcion,
      meses,
      monto,
      amount = '',
      id = '',
      description = '',
    } = req.body;
    let getData = {};

    try {
      await sequelize.transaction(async (transaction) => {
        getTipoPago = await TipoPago.findOne({
          where: { idTipoPago },
        });

        if (!getTipoPago) {
          return res
            .status(409)
            .send({ message: 'Esta Tipo de pago no existe' });
        }

        const { tipo } = getTipoPago;

        if (tipo === 'Tarjeta') {
          const { error, mensaje } = await paymentStripe({
            amount,
            id,
            description,
          });

          if (error) {
            return res.status(409).send({ message: mensaje });
          }

          getData = await Mensualidad.create(
            {
              meses,
              idSuscripcion,
              idTipoPago,
              monto,
            },
            { transaction }
          );
        } else {
          getData = await Mensualidad.create(
            {
              meses,
              idSuscripcion,
              idTipoPago,
              monto,
            },
            { transaction }
          );
        }

        return res.status(201).send({ data: getData });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getMensualidades(req, res) {
    let parseData = [];
    try {
      const mensualidades = await Mensualidad.findAll({
        // include: [
        //   clientSuscripcionParams,
        //   { model: TipoPlan, as: 'SuscripcionTipoPlan' },
        // ],
        order: [['updatedAt', 'DESC']],
      });
      // if (suscripciones.length) {
      //   parseData = suscripciones.map((suscripcion) => {
      //     if (!suscripcion.SuscripcionCliente.ClientePersona) {
      //       return;
      //     }

      //     const {
      //       idSuscripcion,
      //       monto,
      //       status: statusSuscripcion,
      //       createdAt: fecha,
      //       idCliente,
      //       idTipoPlan,
      //       SuscripcionCliente: {
      //         ClientePersona: {
      //           apellido,
      //           status: personStatus,
      //           idEntidad,
      //           EntidadPersona: { nombre, nacimiento, status: entidadStatus },
      //           SexoPersona: { sexo },
      //         },
      //         ClienteIdentidad: {
      //           serie,
      //           TipoIdentidad: { tipo: tipoIdentidad },
      //         },
      //       },
      //       SuscripcionTipoPlan: { tipo, monto: cuotas, status: statusPlan },
      //     } = suscripcion;

      //     return {
      //       idSuscripcion,
      //       monto,
      //       statusSuscripcion,
      //       fecha,
      //       idCliente,
      //       idTipoPlan,
      //       apellido,
      //       personStatus,
      //       idEntidad,
      //       nombre,
      //       nacimiento,
      //       entidadStatus,
      //       sexo,
      //       tipoPlan: tipo,
      //       cuotas,
      //       statusPlan,
      //       identidades: { serie, tipo: tipoIdentidad },
      //     };
      //   });
      // }
      return res.status(200).send({ data: mensualidades });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // async getSuscripcionByClient(req, res) {
  //   const { idCliente } = req.params;
  //   let parseData = [];

  //   try {
  //     const suscripciones = await Suscripcion.findAll({
  //       include: [
  //         clientSuscripcionParams,
  //         { model: TipoPlan, as: 'SuscripcionTipoPlan' },
  //       ],
  //       where: { idCliente },
  //       order: [['updatedAt', 'DESC']],
  //     });
  //     if (suscripciones.length) {
  //       parseData = suscripciones.map((suscripcion) => {
  //         if (!suscripcion.SuscripcionCliente.ClientePersona) {
  //           return;
  //         }

  //         const {
  //           idSuscripcion,
  //           monto,
  //           status: statusSuscripcion,
  //           createdAt: fecha,
  //           idCliente,
  //           idTipoPlan,
  //           SuscripcionCliente: {
  //             ClientePersona: {
  //               apellido,
  //               status: personStatus,
  //               idEntidad,
  //               EntidadPersona: { nombre, nacimiento, status: entidadStatus },
  //               SexoPersona: { sexo },
  //             },
  //             ClienteIdentidad: {
  //               serie,
  //               TipoIdentidad: { tipo: tipoIdentidad },
  //             },
  //           },
  //           SuscripcionTipoPlan: { tipo, monto: cuotas, status: statusPlan },
  //         } = suscripcion;

  //         return {
  //           idSuscripcion,
  //           monto,
  //           statusSuscripcion,
  //           fecha,
  //           idCliente,
  //           idTipoPlan,
  //           apellido,
  //           personStatus,
  //           idEntidad,
  //           nombre,
  //           nacimiento,
  //           entidadStatus,
  //           sexo,
  //           tipoPlan: tipo,
  //           cuotas,
  //           statusPlan,
  //           identidades: { serie, tipo: tipoIdentidad },
  //         };
  //       });
  //     }

  //     return res.status(200).send({ data: { ...parseData[0] } });
  //   } catch (error) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // },
  // // {
  // //   "idCliente": "73cf1508-1a00-4d33-bb25-3b0af1864186",
  // //   "idSuscripcion": "60e3102b-bc12-40fd-b4a5-6c4e71a132e1",
  // //   "idUsuario": "6efb5963-03a2-449d-a66b-97144beba3ed",
  // //   "idTipoPlan": "42ff2a51-bf42-4fcb-9d8f-166462121fd7",
  // //   "monto": 200,
  // //   "idParientes": ["9ee0e212-8772-436c-9a2c-79e5c9dfe791","0adce36a-55c2-4168-a95f-c04cf27df47c"],
  // //   "idClienteEntidad": "fc683b58-8b14-4368-a170-53b6e35b341c",
  // // }
  // async updateSuscripcion(req, res) {
  //   const {
  //     idSuscripcion,
  //     idCliente,
  //     idTipoPlan,
  //     monto,
  //     idUsuario,
  //     status = 'Proceso',
  //     idParientes = [],
  //     idClienteEntidad = '',
  //   } = req.body;
  //   let data = {};

  //   try {
  //     const getSuscripcion = await Suscripcion.findOne({
  //       where: { idSuscripcion },
  //     });

  //     if (!getSuscripcion) {
  //       return res.status(409).send({ message: 'Esta Suscripcion no existe' });
  //     }

  //     if (status === 'Aceptada') {
  //       await Entidad.update(
  //         {
  //           status: true,
  //         },
  //         { where: { idEntidad: idClienteEntidad } }
  //       );

  //       await Promise.all(
  //         await idParientes.map(async (idEntidad) => {
  //           await Entidad.update(
  //             {
  //               status: true,
  //             },
  //             { where: { idEntidad } }
  //           );
  //           return;
  //         })
  //       );
  //     }

  //     data = await Suscripcion.update(
  //       {
  //         idCliente,
  //         idTipoPlan,
  //         monto,
  //         status,
  //       },
  //       { where: { idSuscripcion } }
  //     );

  //     await HistorialSuscripcion.create({
  //       idCliente,
  //       idUsuario,
  //       idTipoPlan,
  //       idSuscripcion,
  //     });

  //     return res.status(201).send({ data });
  //   } catch (error) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // },
  // async deleteSuscripcion(req, res) {
  //   const { idSuscripcion, idParientes = [], idClienteEntidad = '' } = req.body;
  //   let data = {};

  //   try {
  //     const getSuscripcion = await Suscripcion.findOne({
  //       where: { idSuscripcion },
  //     });

  //     if (!getSuscripcion) {
  //       return res.status(409).send({ message: 'Esta Suscripcion no existe' });
  //     }

  //     await Entidad.update(
  //       {
  //         status: false,
  //       },
  //       { where: { idEntidad: idClienteEntidad } }
  //     );

  //     await Promise.all(
  //       await idParientes.map(async (idEntidad) => {
  //         await Entidad.update(
  //           {
  //             status: false,
  //           },
  //           { where: { idEntidad } }
  //         );
  //         return;
  //       })
  //     );

  //     data = await Suscripcion.update(
  //       {
  //         status: 'Cancelada',
  //       },
  //       { where: { idSuscripcion } }
  //     );

  //     await HistorialSuscripcion.create({
  //       idCliente: getSuscripcion.idCliente,
  //       idUsuario: getSuscripcion.idUsuario,
  //       idTipoPlan: getSuscripcion.idTipoPlan,
  //       idSuscripcion,
  //     });

  //     return res.status(201).send({ data });
  //   } catch (error) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // },
};
