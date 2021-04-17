const {
  TipoPlan,
  ArmarPlan,
  Producto,
  UnidadMedida,
  Categoria,
  TipoProducto,
} = require('../../../db/models/relaciones');
// {
//   "idTipoPlan": "sa96629b0-50d7-41b6-966c-abc2fa464466",
//     "detalle": [{idProducto: "8b7d06be-683d-452b-8e23-42bb1b501e2a", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 2},{idProducto: "019345c6-a806-499a-b37c-6ab81d622d4d", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 1},{idProducto: "a47e7717-d628-43f2-a3ba-6aa1f9806652", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 1}],
// }
module.exports = {
  async addArmado(req, res) {
    const { idTipoPlan, detalle } = req.body;

    try {
      const planTypeExist = await TipoPlan.findOne({
        where: { idTipoPlan },
      });

      if (!planTypeExist) {
        return res.status(409).send({
          data: planTypeExist,
          message: 'Este Tipo de Plan no esta registrado.',
        });
      }

      if (detalle.length) {
        await Promise.all(
          detalle.map(async ({ idProducto, cantidad, idUnidadMedida }) => {
            await ArmarPlan.create({
              idTipoPlan,
              idProducto,
              cantidad,
              idUnidadMedida,
            });
          })
        );
      }

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getArmadoByType(req, res) {
    const { idTipoPlan } = req.params;
    let getData = [];
    try {
      const data = await ArmarPlan.findAll({
        include: [
          {
            model: Producto,
            as: 'ArmarProducto',
            include: [
              {
                model: TipoProducto,
                as: 'ProductoTipo',
              },
              {
                model: Categoria,
                as: 'ProductoCategoria',
              },
            ],
          },
          { model: UnidadMedida, as: 'ArmarUnidadMedida' },
        ],
        where: {
          idTipoPlan,
        },
      });

      if (data.length) {
        getData = data.map(
          ({
            id,
            cantidad,
            idUnidadMedida,
            idProducto,
            ArmarProducto: {
              nombre,
              descripcion,
              ProductoTipo: { tipo },
              ProductoCategoria: { categoria },
            },
          }) => ({
            id,
            cantidad,
            idUnidadMedida,
            idProducto,
            nombre,
            descripcion,
            tipo,
            categoria,
          })
        );
      }

      return res.status(201).send({ data: getData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idTipoPlan": "sa96629b0-50d7-41b6-966c-abc2fa464466",
  //     "detalle": [{idProducto: "8b7d06be-683d-452b-8e23-42bb1b501e2a", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 2},{idProducto: "019345c6-a806-499a-b37c-6ab81d622d4d", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 1},{idProducto: "a47e7717-d628-43f2-a3ba-6aa1f9806652", idUnidadMedida: "66b74f77-8257-4bd8-b323-bd43200a37a5", cantidad: 1}],
  // }
  async updateArmado(req, res) {
    const { idTipoPlan, detalle } = req.body;

    try {
      const planTypeExist = await TipoPlan.findOne({
        where: { idTipoPlan },
      });

      if (!planTypeExist) {
        return res.status(409).send({
          data: planTypeExist,
          message: 'Este Tipo de Plan no esta registrado.',
        });
      }

      await ArmarPlan.destroy({ where: { idTipoPlan } });

      if (detalle.length) {
        await Promise.all(
          detalle.map(async ({ idProducto, cantidad, idUnidadMedida }) => {
            await ArmarPlan.create({
              idTipoPlan,
              idProducto,
              cantidad,
              idUnidadMedida,
            });
          })
        );
      }

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idTipoPlan": "sa96629b0-50d7-41b6-966c-abc2fa464466",
  // }
  async DeleteArmado(req, res) {
    const { idTipoPlan } = req.body;

    try {
      const planTypeExist = await TipoPlan.findOne({
        where: { idTipoPlan },
      });

      if (!planTypeExist) {
        return res.status(409).send({
          data: planTypeExist,
          message: 'Este Tipo de Plan no esta registrado.',
        });
      }

      await ArmarPlan.destroy({ where: { idTipoPlan } });

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
