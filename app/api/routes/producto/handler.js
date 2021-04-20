const { Op } = require('sequelize');
const { sequelize } = require('../../../db/config/database');
const {
  Producto,
  ImagenProducto,
  ProductoLog,
  TipoProducto,
  Categoria,
} = require('../../../db/models/relaciones');

// Debe insertar en: Producto, imagenProducto, ProductoLog
// {
//   "nombre": "ataud",
//   "descripcion": "ataud en caoba con boleados",
//   "idTipoProducto": "df339f3a-d80b-4ca3-9250-b7ca26fcfd4c",
//   "idCategoria": "df339f3a-d80b-4ca3-9250-b7ca26fcfd4c",
//   "url": "/img/acta1",
// Solo para producto para los servicios configurarlo
//   "stock": 0,
//   "costo": 0, esto se va a calcular con el presio de la compra, al momento de registrar una compra que eso se actualice. por defecto cero.
//   "precio": 120.00, lo mismo que el anterior
//   "reorden": 20,
//   "idProducto": "23ertg234ertg",

// }

module.exports = {
  async addProducto(req, res) {
    const {
      nombre = '',
      descripcion = '',
      idTipoProducto,
      idCategoria,
      url = '',
      stock = 0,
      costo = 0,
      precio = 0,
      reorden = 20,
    } = req.body;
    let data = {};

    try {
      await sequelize.transaction(async (transaction) => {
        const productoExit = await Producto.findOne({
          where: { nombre },
        });

        if (productoExit) {
          return res.status(409).send({ message: 'Este Producto ya existe' });
        }

        data = await Producto.create(
          {
            nombre,
            descripcion,
            idTipoProducto,
            idCategoria,
          },
          { transaction }
        );

        if (data) {
          const { idProducto } = data;

          await ImagenProducto.create(
            {
              idProducto,
              url,
            },
            { transaction }
          );

          await ProductoLog.create(
            {
              stock,
              costo,
              precio,
              reorden,
              idProducto,
            },
            { transaction }
          );
        }

        return res.status(201).send({ data });
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllProductos(req, res) {
    const { limit = 10 } = req.query;
    let parseData = [];

    try {
      const productos = await Producto.findAll({
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
        order: [['updatedAt', 'DESC']],
      });

      if (productos.length) {
        await Promise.all(
          await productos.map(async (producto) => {
            let getImagen = [];
            let getLog = {};
            let parseGetImagen = [];
            let parseGetLog = {};

            const {
              idProducto,
              nombre,
              descripcion,
              idTipoProducto,
              ProductoTipo: { tipo },
              idCategoria,
              ProductoCategoria: { categoria },
            } = producto;

            getImagen = await ImagenProducto.findAll({
              where: { idProducto },
            });

            if (getImagen.length) {
              parseGetImagen = getImagen.map(({ idImagenProducto, url }) => ({
                idImagenProducto,
                url,
              }));
            }

            getLog = await ProductoLog.findOne({
              where: { idProducto },
            });

            if (getLog) {
              const { idProductoLog, stock, costo, precio, reorden } = getLog;

              parseGetLog = { idProductoLog, stock, costo, precio, reorden };
            }

            return parseData.push({
              idProducto,
              descripcion,
              idTipoProducto,
              tipo,
              idCategoria,
              categoria,
              nombre,
              log: parseGetLog,
              imagenes: parseGetImagen,
            });
          })
        );
      }

      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getProductos(req, res) {
    const { limit = 10, tipo = 'producto' } = req.query;
    let parseData = [];

    try {
      const productos = await Producto.findAll({
        include: [
          {
            model: TipoProducto,
            as: 'ProductoTipo',
            where: { tipo },
          },
          {
            model: Categoria,
            as: 'ProductoCategoria',
          },
        ],
        order: [['updatedAt', 'DESC']],
      });

      if (productos.length) {
        await Promise.all(
          await productos.map(async (producto) => {
            let getImagen = [];
            let getLog = {};
            let parseGetImagen = [];
            let parseGetLog = {};

            const {
              idProducto,
              nombre,
              descripcion,
              idTipoProducto,
              ProductoTipo: { tipo },
              idCategoria,
              ProductoCategoria: { categoria },
            } = producto;

            getImagen = await ImagenProducto.findAll({
              where: { idProducto },
            });

            if (getImagen.length) {
              parseGetImagen = getImagen.map(({ idImagenProducto, url }) => ({
                idImagenProducto,
                url,
              }));
            }

            getLog = await ProductoLog.findOne({
              where: { idProducto },
            });

            if (getLog) {
              const { idProductoLog, stock, costo, precio, reorden } = getLog;

              parseGetLog = { idProductoLog, stock, costo, precio, reorden };
            }

            return parseData.push({
              idProducto,
              descripcion,
              idTipoProducto,
              tipo,
              idCategoria,
              categoria,
              nombre,
              log: parseGetLog,
              imagenes: parseGetImagen,
            });
          })
        );
      }

      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getProductosByCategorias(req, res) {
    const { limit = 10, tipo = 'producto', categoria = 'ataudes' } = req.query;
    let parseData = [];

    try {
      const productos = await Producto.findAll({
        include: [
          {
            model: TipoProducto,
            as: 'ProductoTipo',
            where: { tipo },
          },
          {
            model: Categoria,
            as: 'ProductoCategoria',
            where: { categoria },
          },
        ],
        order: [['updatedAt', 'DESC']],
      });

      if (productos.length) {
        await Promise.all(
          await productos.map(async (producto) => {
            let getImagen = [];
            let getLog = {};
            let parseGetImagen = [];
            let parseGetLog = {};

            const {
              idProducto,
              nombre,
              descripcion,
              idTipoProducto,
              ProductoTipo: { tipo },
              idCategoria,
              ProductoCategoria: { categoria },
            } = producto;

            getImagen = await ImagenProducto.findAll({
              where: { idProducto },
            });

            if (getImagen.length) {
              parseGetImagen = getImagen.map(({ idImagenProducto, url }) => ({
                idImagenProducto,
                url,
              }));
            }

            getLog = await ProductoLog.findOne({
              where: { idProducto },
            });

            if (getLog) {
              const { idProductoLog, stock, costo, precio, reorden } = getLog;

              parseGetLog = { idProductoLog, stock, costo, precio, reorden };
            }

            return parseData.push({
              idProducto,
              descripcion,
              idTipoProducto,
              tipo,
              idCategoria,
              categoria,
              nombre,
              log: parseGetLog,
              imagenes: parseGetImagen,
            });
          })
        );
      }

      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getProductoByName(req, res) {
    const { name: nombre } = req.params;
    const { limit = 10, tipo = 'producto' } = req.query;
    let parseData = [];

    try {
      const productos = await Producto.findAll({
        include: [
          {
            model: TipoProducto,
            as: 'ProductoTipo',
            where: { tipo },
          },
          {
            model: Categoria,
            as: 'ProductoCategoria',
          },
        ],
        where: {
          nombre: {
            [Op.substring]: nombre,
          },
        },
        order: [['updatedAt', 'DESC']],
      });

      if (productos.length) {
        await Promise.all(
          await productos.map(async (producto) => {
            let getImagen = [];
            let getLog = {};
            let parseGetImagen = [];
            let parseGetLog = {};

            const {
              idProducto,
              nombre,
              descripcion,
              idTipoProducto,
              ProductoTipo: { tipo },
              idCategoria,
              ProductoCategoria: { categoria },
            } = producto;

            getImagen = await ImagenProducto.findAll({
              where: { idProducto },
            });

            if (getImagen.length) {
              parseGetImagen = getImagen.map(({ idImagenProducto, url }) => ({
                idImagenProducto,
                url,
              }));
            }

            getLog = await ProductoLog.findOne({
              where: { idProducto },
            });

            if (getLog) {
              const { idProductoLog, stock, costo, precio, reorden } = getLog;

              parseGetLog = { idProductoLog, stock, costo, precio, reorden };
            }

            return parseData.push({
              idProducto,
              descripcion,
              idTipoProducto,
              tipo,
              idCategoria,
              categoria,
              nombre,
              log: parseGetLog,
              imagenes: parseGetImagen,
            });
          })
        );
      }

      // if (parseData.length > limit) {
      //   parseData = parseData.slice(0, limit + 1);
      // }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getTypeProducto(req, res) {
    let parseData = [];

    try {
      const typeProductos = await TipoProducto.findAll();

      if (typeProductos.length) {
        parseData = typeProductos.map(({ idTipoProducto, tipo }) => ({
          idTipoProducto,
          tipo,
        }));
      }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getCategoria(req, res) {
    let parseData = [];

    try {
      const categorias = await Categoria.findAll();

      if (categorias.length) {
        parseData = categorias.map(({ idCategoria, categoria }) => ({
          idCategoria,
          categoria,
        }));
      }

      return res.status(200).send({ data: parseData });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  // {
  //   "idProducto": "dfcc8770-1785-401e-ae97-4be036d2ff7d",
  //   "nombre": "ataud",
  //   "descripcion": "ataud en caoba con boleados",
  //    "idTipoProducto": "38e55ea0-8488-4a16-afbe-5f0f25fd2f7a",
  //    "idCategoria": "2a12704c-9715-405c-9ebd-5e76cd9ffdb4",
  //    "idImagenProducto": "3b61260d-92b9-43aa-9f3c-096b09cd82e5",
  //    "idProductoLog": "8354254d-96cc-4ce5-b6b7-396838fe8171",
  //   "url": "/img/acta1",
  // "stock": 0,
  // "costo": 0,
  // "precio": 0,
  // "reorden": 20

  // }
  async updateProducto(req, res) {
    const {
      idProducto,
      nombre = '',
      descripcion = '',
      idTipoProducto,
      idCategoria,
      idImagenProducto,
      idProductoLog,
      url = '',
      // stock = 0,
      // costo = 0,
      // precio = 0,
      reorden = 20,
    } = req.body;
    let data = {};

    try {
      const productoExit = await Producto.findOne({
        where: { idProducto },
      });

      if (!productoExit) {
        return res.status(409).send({ message: 'Este Producto no existe' });
      }

      data = await Producto.update(
        {
          nombre,
          descripcion,
          idTipoProducto,
          idCategoria,
        },
        { where: { idProducto } }
      );

      if (data) {
        await ImagenProducto.update(
          {
            idProducto,
            url,
          },
          { where: { idImagenProducto } }
        );

        await ProductoLog.update(
          {
            // stock,
            // costo,
            // precio,
            reorden,
            idProducto,
          },
          { where: { idProductoLog } }
        );
      }

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async deleteProducto(req, res) {
    const { idProducto, idImagenProducto, idProductoLog } = req.body;

    try {
      await Producto.destroy({ where: { idProducto } });

      await ImagenProducto.destroy({ where: { idImagenProducto } });

      await ProductoLog.destroy({ where: { idProductoLog } });

      return res.status(201).send({ data: '1' });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
