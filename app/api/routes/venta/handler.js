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
} = require("../../../db/models/relaciones");

// {
//   "idCliente": "sdssdwewedcd",
//     "detalle": [{numCompra: "we233", idProducto: "wedw232", cantidad: 12, precio: 200}],
//     "tipoPagos":["2c961280-b2b5-4188-aa01-8e47a524c362"],
//     "total": 200,
//     "idItebit": "2wedfgq3werdfwesd"
// }
module.exports = {
  async addVenta(req, res) {
    const { idCliente, detalle, total, tipoPagos, idItebis } = req.body;
    let data = {};

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
        NFC: "eewwewewe",
        idItebis,
      });

      const { numFactura } = data;

      if (tipoPagos.length) {
        await data.setFacturaTipoPago(tipoPagos);
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

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
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

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getVenta(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const compra = await Factura.findAll({
        include: [
          // {
          //   model: Suplidor,
          //   as: "CompraSuplidor",
          //   // include:[
          //   //   personSuplidorParams
          //   // ]
          // },
          {
            model: DetalleFactura,
            as: "FacturaDetalle",
            include: [{ model: Producto, as: "DetalleFacturaProducto" }],
          },
        ],
      });

      // if (compra.length) {
      //     compra.map( (comp) => {
      //       let getNameDireccions = {};
      //       const {
      //         numCompra,
      //         total,
      //         status,
      //         createdAt,
      //         TipoUsuario: { tipo },
      //         EntidadUsuario: {
      //           nombre,
      //           nacimiento,
      //           EntidadTelefono,
      //           EntidadDireccion,
      //         },
      //       } = comp;

      //       const telefonos = EntidadTelefono.map(
      //         ({ idTelefono, telefono, TipoTele: { tipo } }) => ({
      //           idTelefono,
      //           telefono,
      //           tipo,
      //         })
      //       );

      //       if (EntidadDireccion.length) {
      //         getNameDireccions = await getNameDireccion(EntidadDireccion[0]);
      //       }

      //       return parseData.push({
      //         idUsuario,
      //         usuario,
      //         idEntidad,
      //         idTipoUsuario,
      //         tipo,
      //         nombre,
      //         nacimiento,
      //         telefonos,
      //         direcciones: EntidadDireccion,
      //         ...getNameDireccions,
      //       });
      //     })

      // }
      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(201).send({ data: compra });
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
      if (parseData.length > limit) {
        parseData = parseData.slice(0, limit + 1);
      }

      return res.status(201).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // async updateUser(req, res) {
  //   const { idUsuario, usuario, password, idTipoUsuario, idEntidad } = req.body;
  //   let data = {};

  //   try {
  //     const userExist = await Usuario.findOne({
  //       where: { idUsuario },
  //     });

  //     if (!userExist) {
  //       return res.status(409).send({
  //         data: userExist,
  //         message: 'Este Usuario no existe.',
  //       });
  //     }

  //     if (!idTipoUsuario) {
  //       return res.status(409).send({
  //         data: idTipoUsuario,
  //         message: 'El tipo de Usuario debe ser valido.',
  //       });
  //     }

  //     data = await Usuario.update(
  //       {
  //         usuario,
  //         password,
  //         idEntidad,
  //         idTipoUsuario,
  //       },
  //       { where: { idUsuario }, individualHooks: true }
  //     );

  //     return res.status(201).send({ data });
  //   } catch (error) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // },
  // async deleteUser(req, res) {
  //   const { idUsuario } = req.body;

  //   try {
  //     await Usuario.destroy({ where: { idUsuario } });

  //     return res.status(201).send({ data: '1' });
  //   } catch (error) {
  //     return res.status(500).send({ message: error.message });
  //   }
  // },
};
