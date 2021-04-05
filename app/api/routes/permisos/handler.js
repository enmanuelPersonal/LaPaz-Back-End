const { Permisos, TipoUsuario } = require('../../../db/models/relaciones');

module.exports = {
  async addPermiso(req, res) {
    const { permiso } = req.body;

    try {
      const permisoTypeExist = await Permisos.findOne({
        where: { permiso },
      });

      if (permisoTypeExist) {
        return res.status(409).send({
          data: permisoTypeExist,
          message: 'Este Permiso ya esta registrado.',
        });
      }

      const data = await Permisos.create({
        permiso,
      });

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getAllPermiso(req, res) {
    try {
      const data = await Permisos.findAll();

      return res.status(201).send({ data });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async getPermisoByTypeUsuario(req, res) {
    const { idTipoUsuario } = req.params;
    let getPermisos = [];
    try {
      const data = await TipoUsuario.findOne({
        include: [{ model: Permisos, as: 'TipoUsuarioPermisos' }],
        where: { idTipoUsuario },
      });

      if (data) {
        const { TipoUsuarioPermisos } = data;

        getPermisos = TipoUsuarioPermisos.map(({ idPermiso, permiso }) => ({
          idPermiso,
          permiso,
        }));
      }

      return res.status(201).send({ data: getPermisos });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
