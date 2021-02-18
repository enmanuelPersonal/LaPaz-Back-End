const { TipoUsuario } = require('../../../db/models/relaciones');

module.exports = {
  async addTypeUser(req, res) {
    const { tipo, permisos = [] } = req.body;

    try {
      const userTypeExist = await TipoUsuario.findOne({
        where: { tipo },
      });

      if (userTypeExist) {
        return res.status(409).send({
          data: userTypeExist,
          message: 'Este Tipo de Usuario ya esta registrado.',
        });
      }

      const data = await TipoUsuario.create({
        tipo,
      });

      await data.setTipoUsuarioPermisos(permisos);

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllTypeUser(req, res) {
    try {
      const data = await TipoUsuario.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
