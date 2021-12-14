const {
  ImagenProducto,
  Suplidor,
  Identidad,
  TipoIdentidad,
  Producto,
  ProductoLog,
  Entidad,
  Persona,
  Pedido,
  DetallePedido,
  ConfSuplidor,
} = require("../../../db/models/relaciones");
const {
  cancelarCorreoPedido,
} = require("../../helpers/correos/cancelarPedido");
const { personSuplidorParams } = require("../../utils/constant");
const { addCompraByPedido } = require("./addCompra");

module.exports = {
  async getAllPedidos(req, res) {
    let parseData = [];
    try {
      const pedidos = await Pedido.findAll({
        include: [
          {
            model: Suplidor,
            as: "PedidoSuplidor",
            include: [
              {
                model: Persona,
                as: "SuplidorPersona",

                include: [
                  {
                    model: Entidad,
                    as: "EntidadPersona",
                    where: { status: true },
                  },
                ],
              },
            ],
          },
          {
            model: DetallePedido,
            as: "PedidoDetalle",
            include: [{ model: Producto, as: "DetallePedidoProducto" }],
          },
        ],
      });

      if (pedidos.length) {
        pedidos.map((comp) => {
          const {
            numPedido,
            total,
            status,
            createdAt,
            fechaEntrega,
            idSuplidor,
            PedidoSuplidor: {
              SuplidorPersona: {
                apellido,
                EntidadPersona: { nombre },
              },
            },
            PedidoDetalle,
          } = comp;

          let getDetalle = [];
          if (PedidoDetalle.length) {
            getDetalle = PedidoDetalle.map(
              ({
                idProducto,
                cantidad,
                precio,
                DetallePedidoProducto: { nombre, descripcion },
              }) => ({ cantidad, precio, nombre, descripcion, idProducto })
            );
          }
          return parseData.push({
            numPedido,
            total,
            status,
            idSuplidor,
            createdAt,
            fechaEntrega,
            apellido,
            nombre,
            detalle: getDetalle,
          });
        });
      }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getPedidosByStatus(req, res) {
    const { status = "Proceso" } = req.params;
    let parseData = [];
    try {
      const pedidos = await Pedido.findAll({
        order: [['updatedAt', 'DESC']],
        include: [
          {
            model: Suplidor,
            as: "PedidoSuplidor",
            include: [
              {
                model: Persona,
                as: "SuplidorPersona",

                include: [
                  {
                    model: Entidad,
                    as: "EntidadPersona",
                    where: { status: true },
                  },
                ],
              },
            ],
          },
          {
            model: DetallePedido,
            as: "PedidoDetalle",
            include: [{ model: Producto, as: "DetallePedidoProducto" }],
          },
        ],
        where: { status },
      });

      if (pedidos.length) {
        pedidos.map((comp) => {
          const {
            numPedido,
            total,
            status,
            createdAt,
            fechaEntrega,
            idSuplidor,
            PedidoSuplidor: {
              SuplidorPersona: {
                apellido,
                EntidadPersona: { nombre },
              },
            },
            PedidoDetalle,
          } = comp;

          let getDetalle = [];
          if (PedidoDetalle.length) {
            getDetalle = PedidoDetalle.map(
              ({
                idProducto,
                cantidad,
                precio,
                DetallePedidoProducto: { nombre, descripcion },
              }) => ({ cantidad, precio, nombre, descripcion, idProducto })
            );
          }
          return parseData.push({
            numPedido,
            total,
            status,
            idSuplidor,
            createdAt,
            fechaEntrega,
            apellido,
            nombre,
            detalle: getDetalle,
          });
        });
      }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idSuplidor": "sdssdwewedcd",
  //     "detalle": [{idProducto: "wedw232", cantidad: 12, precio: 200}],
  //     "tipoPagos":["2c961280-b2b5-4188-aa01-8e47a524c362"],
  //     "total": 200
  //     "numPedido": 111111
  // }
  async updatePedido(req, res) {
    const {
      numPedido,
      idSuplidor,
      detalle,
      total,
      status = "Proceso",
    } = req.body;

    const hoy = new Date();

    try {
      if (status === "Completado") {
        await Pedido.update(
          {
            status,
            fechaEntrega: '2021-01-20 03:08:35.889+00',
          },
          { where: { numPedido } }
        );

        const { error } = await addCompraByPedido({
          idSuplidor,
          detalle,
          total,
          numPedido,
        });

        if (error === true) {
          return res.status(409).send({
            data: false,
            message: "Fallo al realizar la compra",
          });
        }
      } else {
        await Pedido.update(
          {
            status,
          },
          { where: { numPedido } }
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
  async DeletePedido(req, res) {
    // Cancelar el pedido
    let getDetalle = [];

    const { numPedido, idSuplidor, total, fecha } = req.body;
    try {
      await Pedido.update(
        {
          status: "Cancelado",
        },
        { where: { numPedido } }
      );

      const getDetallePedidoProducto = await DetallePedido.findAll({
        where: { numPedido },
      });

      if (getDetallePedidoProducto.length) {
        await Promise.all(
          getDetallePedidoProducto.map(async ({ idProducto, precio }) => {
            const { cantCompra } = await ProductoLog.findOne({
              where: { idProducto },
            });

            const { nombre, descripcion } = await Producto.findOne({
              where: { idProducto },
            });

            const { url } = await ImagenProducto.findOne({
              where: { idProducto },
            });

            getDetalle.push({
              precio,
              cantidad: cantCompra,
              imagen: url,
              nombre,
              descripcion,
            });
          })
        );

        const {
          SuplidorPersona: {
            EntidadPersona: { EntidadCorreo },
          },
        } = await Suplidor.findOne({
          where: { idSuplidor },
          include: [personSuplidorParams],
        });

        await cancelarCorreoPedido({
          correo: EntidadCorreo[0].correo,
          detalle: getDetalle,
          total,
          fecha,
        });
      }

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async updateConfSuplidor(req, res) {
    const { isRequerido = true } = req.body;

    try {
      await ConfSuplidor.update(
        {
          isRequerido,
        },
        { where: { validacion: "tiempoEntrega" } }
      );

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getConfSuplidor(req, res) {
    try {
      const { isRequerido } = await ConfSuplidor.findOne({
        where: { validacion: "tiempoEntrega" },
      });

      return res.status(201).send({ data: isRequerido });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
