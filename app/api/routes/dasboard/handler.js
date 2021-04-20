const { sequelize } = require('../../../db/config/database');
const {
  Compra,
  Factura,
  Suscripcion,
  Pariente,
} = require('../../../db/models/relaciones');

module.exports = {
  async getIngresos(req, res) {
    try {
      const getTotalCompra = await Compra.sum('total');
      const getTotalVenta = await Factura.sum('total');

      const ingresos = parseFloat(getTotalVenta - getTotalCompra);

      return res.status(201).send({ data: parseFloat(ingresos).toFixed(2) });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTotalSuscripcion(req, res) {
    try {
      const getTotalSuscripcion = await Suscripcion.count();

      return res.status(201).send({ data: getTotalSuscripcion });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTotalParientes(req, res) {
    try {
      const getTotalParientes = await Pariente.count();

      return res.status(201).send({ data: getTotalParientes });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTotalVentaMes(req, res) {
    const dateNow = new Date();

    try {
      const getTotalVentaMes = await Factura.sum('total', {
        where: sequelize.where(
          sequelize.fn(
            'date_part',
            'month',
            sequelize.col('Factura.createdAt')
          ),
          dateNow.getMonth() + 1
        ),
      });

      return res
        .status(201)
        .send({ data: parseFloat(getTotalVentaMes).toFixed(2) });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTotalVentaYearByMes(req, res) {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const getTotalMes = [];

    try {
      await Promise.all(
        await meses.map(async (mes) => {
          let getTotalVentaMes = await Factura.sum('total', {
            where: sequelize.where(
              sequelize.fn(
                'date_part',
                'month',
                sequelize.col('Factura.createdAt')
              ),
              mes
            ),
          });

          return getTotalMes.push(getTotalVentaMes);
        })
      );

      return res.status(201).send({ data: getTotalMes });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTotalSuscripcionMes(req, res) {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const getTotalMes = [];

    try {
      await Promise.all(
        await meses.map(async (mes) => {
          let getTotalSuscripcionMes = await Suscripcion.count({
            where: sequelize.where(
              sequelize.fn(
                'date_part',
                'month',
                sequelize.col('Suscripcion.createdAt')
              ),
              mes
            ),
          });

          return getTotalMes.push(getTotalSuscripcionMes);
        })
      );

      return res.status(201).send({ data: getTotalMes });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
