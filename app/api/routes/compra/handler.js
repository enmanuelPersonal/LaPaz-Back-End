const { sequelize } = require('../../../db/config/database');
const {
  Usuario,
  TipoProducto,
  Suplidor,
  Compra,
  DetalleCompra,
  Producto,
  ProductoLog,
  TipoPago,
} = require('../../../db/models/relaciones');
const { findOrCreate } = require('../../helpers/productoSuplidor');
const {
  personUserParams,
  personSuplidorParams,
} = require('../../utils/constant');
// {
//   "idSuplidor": "sdssdwewedcd",
//     "detalle": [{numCompra: "we233", idProducto: "wedw232", cantidad: 12, precio: 200}],
//     "tipoPagos":["2c961280-b2b5-4188-aa01-8e47a524c362"],
//     "total": 200
// }
module.exports = {
  async addCompra(req, res) {
    const { idSuplidor, detalle, total } = req.body;
    let data = {};

    try {
      const suplidorExist = await Suplidor.findOne({
        where: { idSuplidor },
      });

      if (!suplidorExist) {
        return res.status(409).send({
          data: suplidorExist,
          message: 'Este Suplidor no existe.',
        });
      }

      if (!detalle.length) {
        return res.status(409).send({
          data: [],
          message: 'Debe tener productos seleccionados.',
        });
      }

      // if (!tipoPagos.length) {
      //   return res.status(409).send({
      //     data: [],
      //     message: 'Debe tener un tipo de pago.',
      //   });
      // }

      const { idTipoPago } = await TipoPago.findOne({
        where: { tipo: 'Efectivo' },
      });

      data = await Compra.create({
        idSuplidor,
        total,
      });

      const { numCompra } = data;

      if (idTipoPago) {
        await data.setCompraTipoPago([idTipoPago]);
      }

      await Promise.all(
        detalle.map(async ({ idProducto, cantidad, precio }) => {
          await DetalleCompra.create({
            numCompra,
            idProducto,
            cantidad,
            precio,
          });

          await findOrCreate({ idSuplidor, idProducto });

          const getLog = await ProductoLog.findOne({ where: { idProducto } });

          if (getLog) {
            const { stock } = getLog;

            const productos = await Producto.findOne({
              include: [
                {
                  model: TipoProducto,
                  as: 'ProductoTipo',
                  where: { tipo: 'producto' },
                },
              ],
              where: { idProducto },
            });

            let getSumaResult = 0;
            let getSumaCantidad = 0;

            const getDetalle = await DetalleCompra.findAll({
              attributes: [
                [
                  sequelize.fn('SUM', sequelize.col('cantidad')),
                  'cantProducto',
                ],
                [sequelize.fn('SUM', sequelize.col('precio')), 'sumPrecio'],
              ],

              where: {
                idProducto,
              },

              group: ['precio'],
            });

            getDetalle.forEach(
              ({ dataValues: { cantProducto, sumPrecio } }) => {
                getSumaResult += parseInt(cantProducto) * sumPrecio;
                getSumaCantidad += parseInt(cantProducto);
              }
            );

            const resPrecio = Math.round(getSumaResult / getSumaCantidad);

            if (productos) {
              await ProductoLog.update(
                {
                  stock: stock + cantidad,
                  costo: resPrecio,
                  precio: resPrecio * 1.05,
                },
                { where: { idProducto } }
              );
            } else {
              await ProductoLog.update(
                {
                  stock: stock + cantidad,
                  costo: resPrecio,
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
  async getCompra(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const compra = await Compra.findAll({
        include: [
          {
            model: Suplidor,
            as: 'CompraSuplidor',
            // include:[
            //   personSuplidorParams
            // ]
          },
          {
            model: DetalleCompra,
            as: 'CompraDetalle',
            include: [{ model: Producto, as: 'DetalleCompraProducto' }],
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
