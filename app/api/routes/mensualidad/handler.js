const { sequelize } = require('../../../db/config/database');
const {
  Suscripcion,
  TipoPago,
  Mensualidad,
  TipoPlan,
} = require('../../../db/models/relaciones');
const { paymentStripe } = require('../../helpers/pagos/pagos');
const { clientMensualidadParams } = require('../../utils/constant');

// {
// "idTipoPago": "f0ab9552-411b-4506-8824-42201ac90445",
//   "idSuscripcion": "2268b136-4d23-443e-90c2-1c714a1d15bd",
// "meses": 1
// "monto": 1000,
// "amount": 1000 ,
// id: "12345ty345" ,
// "description": "Pago del mes de enero"
// }

module.exports = {
  async addMensualidad(req, res) {
    const {
      idTipoPago = '',
      idSuscripcion,
      meses,
      monto,
      amount = '',
      id = '',
      description = '',
    } = req.body;
    let getData = {};
    let getTipo = '';
    let getIdTipoPago = '';

    try {
      await sequelize.transaction(async (transaction) => {
        if (idTipoPago) {
          const getTipoPago = await TipoPago.findOne({
            where: { idTipoPago },
          });

          if (!getTipoPago) {
            return res
              .status(409)
              .send({ message: 'Esta Tipo de pago no existe' });
          }
          const { tipo } = getTipoPago;

          getTipo = tipo;
          getIdTipoPago = idTipoPago;
        } else {
          const { idTipoPago, tipo } = await TipoPago.findOne({
            where: { tipo: 'Efectivo' },
          });

          getTipo = tipo;
          getIdTipoPago = idTipoPago;
        }

        if (getTipo === 'Tarjeta') {
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
              idTipoPago: getIdTipoPago,
              monto,
            },
            { transaction }
          );
        } else {
          getData = await Mensualidad.create(
            {
              meses,
              idSuscripcion,
              idTipoPago: getIdTipoPago,
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
  async addMensualidadClient(req, res) {
    const { idSuscripcion, meses, monto } = req.body;
    let getData = {};

    try {
      await sequelize.transaction(async (transaction) => {
        const getTipoPago = await TipoPago.findOne({
          where: { tipo: 'Tarjeta' },
        });

        getData = await Mensualidad.create(
          {
            meses,
            idSuscripcion,
            idTipoPago: getTipoPago.idTipoPago,
            monto,
          },
          { transaction }
        );

        return res.status(201).send({ data: getData });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getMensualidades(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];
    try {
      const mensualidades = await Mensualidad.findAll({
        include: [
          { model: TipoPago, as: 'MensualidadTipoPago' },
          {
            model: Suscripcion,
            as: 'MensualidadSuscripcion',
            include: [
              clientMensualidadParams,
              { model: TipoPlan, as: 'SuscripcionTipoPlan' },
            ],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
      if (mensualidades.length) {
        parseData = mensualidades.map((mensualidad) => {
          if (!mensualidad.MensualidadSuscripcion.idCliente) {
            return;
          }

          const {
            monto,
            meses,
            status,
            createdAt: fecha,
            idSuscripcion,
            idTipoPago,
            MensualidadTipoPago: { tipo },
            MensualidadSuscripcion: {
              idCliente,
              SuscripcionCliente: { ClienteIdentidad },
            },
          } = mensualidad;

          return {
            monto,
            meses,
            status,
            fecha,
            idSuscripcion,
            idTipoPago,
            idCliente,
            tipoPago: tipo,
            identidad: ClienteIdentidad,
          };
        });
      }

      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getMensualidadesByClient(req, res) {
    const { idCliente } = req.params;
    const { limit = 10 } = req.query;
    let parseData = [];
    try {
      const { idSuscripcion } = await Suscripcion.findOne({
        where: { idCliente },
      });

      const mensualidades = await Mensualidad.findAll({
        include: [{ model: TipoPago, as: 'MensualidadTipoPago' }],
        where: { idSuscripcion },
        order: [['updatedAt', 'DESC']],
      });
      if (mensualidades.length) {
        parseData = mensualidades.map((mensualidad) => {
          const {
            monto,
            meses,
            status,
            createdAt: fecha,
            idSuscripcion,
            idTipoPago,
            MensualidadTipoPago: { tipo },
          } = mensualidad;

          return {
            monto,
            meses,
            status,
            fecha,
            idSuscripcion,
            idTipoPago,
            tipoPago: tipo,
          };
        });
      }

      if (parseData.length > limit) {
        parseData = parseData.slice(0, limit + 1);
      }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
