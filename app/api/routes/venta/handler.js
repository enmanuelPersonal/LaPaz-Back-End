const {
  TipoProducto,
  TipoPago,
  Producto,
  ProductoLog,
  Cliente,
  Factura,
  DetalleFactura,
  Itebis,
  Persona,
  SalidaServicios,
  Transporte,
  Entidad,
} = require("../../../db/models/relaciones");
const { createDireccion } = require("../../helpers/direccion/direccion");
const { createPedido } = require("../../helpers/Pedidos/Pedidos");

// {
//   "idCliente": "e9b53c62-5363-4efd-9fe6-a5efe9b61405",
//   "NFC": "12dwewew",
//     "detalle": [{idProducto: "8b7d06be-683d-452b-8e23-42bb1b501e2a", cantidad: 1, precio: 2100},{idProducto: "019345c6-a806-499a-b37c-6ab81d622d4d", cantidad: 1, precio: 1575},{idProducto: "2ce40658-cd30-4a48-b969-9a0709775a5d", cantidad: 1 }],
//     "tipoPagos":["452b17d9-415d-4c26-a306-e796c6740688"],
//     "total": 20000,
//     "idItebit": "4aa9b55b-ef67-4c01-a1a9-084ad7bade7c",
// Para el transporte
//   "idEmpleado": "5bdce8b9-89ea-4f0b-b9a0-b0694e0f77ed",
//   "idVehiculo": "552a462d-3d86-4a8c-a974-b0ef03ba2324",
//   "idDireccion": "9f6bf19c-4389-4518-8fba-19f6204e6edd",
//   "hora": "sdssdwewedcd",
//   "isEnvio": false,
// Crear direccion
//   "direcciones" : [{"pais": "Republica Dominicana", "region":"Norte", "ciudad": "Santiago", "municipio":"Punal", "sector": "Laguna Prieta", "calle":"Los estrellas", "casa":"16", "referencia": "frente a la banca"}]
// }
module.exports = {
  async addVenta(req, res) {
    const {
      idCliente,
      detalle,
      total,
      NFC,
      tipoPagos,
      idItebis,
      idEmpleado,
      idVehiculo,
      idDireccion = "",
      direcciones = [],
      isEnvio = true,
    } = req.body;
    let data = {};
    let getIdDireccion = idDireccion;
    let getDate = new Date();

    try {
      const clientExist = await Cliente.findOne({
        where: { idCliente },
      });

      if (!clientExist) {
        return res.status(409).send({
          data: clientExist,
          message: "Este Cliente no existe.",
        });
      }

      if (!detalle.length) {
        return res.status(409).send({
          data: [],
          message: "Debe tener productos seleccionados.",
        });
      }

      if (!tipoPagos.length) {
        return res.status(409).send({
          data: [],
          message: "Debe tener un tipo de pago.",
        });
      }

      data = await Factura.create({
        idCliente,
        total,
        NFC,
        idItebis,
      });

      const { numFactura } = data;

      if (tipoPagos.length) {
        await data.setFacturaTipoPago(tipoPagos);
      }

      await Promise.all(
        detalle.map(async ({ idProducto, cantidad, precio = 0 }) => {
          await DetalleFactura.create({
            numFactura,
            idProducto,
            cantidad,
            precio,
          });

          const getLog = await ProductoLog.findOne({ where: { idProducto } });

          if (getLog) {
            const { stock } = getLog;

            const productos = await Producto.findOne({
              include: [
                {
                  model: TipoProducto,
                  as: "ProductoTipo",
                  where: { tipo: "producto" },
                },
              ],
              where: { idProducto },
            });

            await ProductoLog.update(
              {
                stock: stock - cantidad,
              },
              { where: { idProducto } }
            );
            if (!productos) {
              await SalidaServicios.create({
                numFactura,
                idProducto,
                cantidad,
              });
            }
          }
        })
      );

      if (isEnvio) {
        if (!idDireccion && direcciones.length) {
          const direccionesIds = await createDireccion({
            direcciones,
          });

          if (!direccionesIds) {
            return {
              status: false,
              message: "Direcciones incorrectas",
            };
          }
          getIdDireccion = direccionesIds[0];
        }

        await Transporte.create({
          numFactura,
          idEmpleado,
          idVehiculo,
          idDireccion: getIdDireccion,
          hora: `${getDate.getHours()}:${getDate.getMinutes()}:${getDate.getSeconds()}`,
        });
      }

      await createPedido({ detalle });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idEntidad": "sdssdwewedcd",
  //     "detalle": [{numCompra: "we233", idProducto: "wedw232", cantidad: 12, precio: 200}],
  //     "total": 200,
  // }
  async addVentaByIdEntidad(req, res) {
    const { idEntidad, detalle, total } = req.body;
    let data = {};

    try {
      const { idPersona } = await Persona.findOne({
        where: { idEntidad },
      });

      const { idCliente } = await Cliente.findOne({
        where: { idPersona },
      });

      if (!detalle.length) {
        return res.status(409).send({
          data: [],
          message: "Debe tener productos seleccionados.",
        });
      }

      const getTipoPago = await TipoPago.findOne({
        where: { tipo: "Tarjeta" },
      });

      const getItebit = await Itebis.findOne({
        where: { porcentaje: 0.18 },
      });

      data = await Factura.create({
        idCliente,
        total,
        NFC: "eewwewewe",
        idItebis: getItebit.idItebis,
      });

      const { numFactura } = data;

      if (getTipoPago) {
        await data.setFacturaTipoPago([getTipoPago.idTipoPago]);
      }

      await Promise.all(
        detalle.map(async ({ idProducto, cantidad, precio }) => {
          await DetalleFactura.create({
            numFactura,
            idProducto,
            cantidad,
            precio,
          });

          const getLog = await ProductoLog.findOne({ where: { idProducto } });

          if (getLog) {
            const { stock } = getLog;

            const productos = await Producto.findOne({
              include: [
                {
                  model: TipoProducto,
                  as: "ProductoTipo",
                  where: { tipo: "producto" },
                },
              ],
              where: { idProducto },
            });

            if (productos) {
              await ProductoLog.update(
                {
                  stock: stock - cantidad,
                },
                { where: { idProducto } }
              );
            }
          }
        })
      );

      await createPedido({ detalle });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getVenta(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const factura = await Factura.findAll({
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: Cliente,
            as: "FacturaCliente",
            include: [
              {
                model: Persona,
                as: "ClientePersona",

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
            model: DetalleFactura,
            as: "FacturaDetalle",
            include: [{ model: Producto, as: "DetalleFacturaProducto" }],
          },
        ],
      });

      if (factura.length) {
        factura.map((comp) => {
          const {
            numFactura,
            total,
            status,
            createdAt,
            FacturaCliente: {
              ClientePersona: {
                apellido,
                EntidadPersona: { nombre },
              },
            },
            FacturaDetalle,
          } = comp;

          const getDetalle = FacturaDetalle.map(
            ({
              cantidad,
              precio,
              DetalleFacturaProducto: { nombre, descripcion },
            }) => ({
              cantidad,
              precio,
              nombre,
              descripcion,
            })
          );

          return parseData.push({
            numFactura,
            total,
            status,
            createdAt,
            apellido,
            nombre,
            detalle: getDetalle,
          });
        });
      }
      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getVentaByCliente(req, res) {
    const { limit = 10 } = req.query;
    const { idEntidad } = req.params;
    let parseData = [];

    try {
      const { idPersona } = await Persona.findOne({
        where: { idEntidad },
      });

      const { idCliente } = await Cliente.findOne({
        where: { idPersona },
      });

      const compra = await Factura.findAll({
        order: [["updatedAt", "DESC"]],
        include: [
          {
            model: DetalleFactura,
            as: "FacturaDetalle",
            include: [{ model: Producto, as: "DetalleFacturaProducto" }],
          },
        ],
        where: { idCliente },
      });

      if (compra.length) {
        compra.map((comp) => {
          const { numFactura, total, status, createdAt, FacturaDetalle } = comp;

          const detalle = FacturaDetalle.map(
            ({ cantidad, precio, DetalleFacturaProducto: { nombre } }) => ({
              cantidad,
              precio,
              nombre,
            })
          );

          return parseData.push({
            numFactura,
            total,
            status,
            createdAt,
            detalle,
          });
        });
      }
      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async updateVenta(req, res) {
    const {
      numFactura,
      status = true,
      statusTransporte = "Proceso",
      isEnvio = true,
    } = req.body;

    try {
      await Factura.update(
        {
          status,
        },
        { where: { numFactura } }
      );

      if (isEnvio) {
        await Transporte.update(
          {
            status: statusTransporte,
          },
          { where: { numFactura } }
        );
      }

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteVenta(req, res) {
    const { numFactura, isEnvio = true } = req.body;

    try {
      await Factura.update(
        {
          status: false,
        },
        { where: { numFactura } }
      );

      if (isEnvio) {
        await Transporte.update(
          {
            status: "Cancelada",
          },
          { where: { numFactura } }
        );
      }

      return res.status(201).send({ data: true });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
