const { Categoria } = require('../../../db/models/relaciones');

module.exports = {
  async addCategoria(req, res) {
    const { categoria } = req.body;

    try {
      const categoriaExist = await Categoria.findOne({
        where: { categoria },
      });

      if (categoriaExist) {
        return res.status(409).send({
          data: categoriaExist,
          message: 'Esta categoria ya esta registrado.',
        });
      }

      const data = await Categoria.create({
        categoria,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllCategoria(req, res) {
    try {
      const data = await Categoria.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
