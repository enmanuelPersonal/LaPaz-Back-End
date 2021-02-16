const { cookieCreator } = require('../../utils');
const bcrypt = require('bcrypt');
const {
  Usuario,
  Entidad,
  TipoUsuario,
  Permisos,
} = require('../../../db/models/relaciones');

module.exports = {
  async auth(req, res) {
    const { tipoUsuario, idEntidad, nombre, permisos } = req.authEntity;

    try {
      return res
        .status(200)
        .send({ data: { tipoUsuario, idEntidad, nombre, permisos } });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
  async logIn(req, res) {
    const { usuario, password } = req.body;
    const permisos = [];

    try {
      const getUser = await Usuario.findOne({
        where: { usuario },
        include: [
          {
            model: Entidad,
            as: 'EntidadUsuario',
            attributes: ['nombre'],
          },
          {
            model: TipoUsuario,
            as: 'TipoUsuario',
            attributes: ['tipo'],
            include: {
              model: Permisos,
              as: 'TipoUsuarioPermisos',
            },
          },
        ],
      });

      if (!getUser) {
        return res.status(404).send({
          message: 'No person found with the given id number',
        });
      }

      const {
        password: hashedPwd = '',
        idEntidad = null,
        EntidadUsuario: { nombre = '' },
        TipoUsuario: { tipo, TipoUsuarioPermisos },
      } = getUser || {};

      TipoUsuarioPermisos?.forEach((v) => permisos.push(v.permiso));

      const isCorrectPassword = await bcrypt.compare(password, hashedPwd);

      // tipoUsuario, idEntidad, nombre, permisos
      if (isCorrectPassword) {
        const { cookie, cookieConfig } = cookieCreator({
          tipoUsuario: tipo,
          idEntidad,
          nombre,
          permisos,
        });

        res.cookie('LaPaz_auth_token', cookie, cookieConfig);
        return res.status(200).send({
          data: { tipoUsuario: tipo, idEntidad, nombre, permisos },
          login: isCorrectPassword,
          token: cookie,
        });
      }

      return res
        .status(401)
        .send({ login: false, message: 'Invalid Credentials' });
    } catch (error) {
      return res.status(500).send({ login: false, message: error.message });
    }
  },
  logOut(req, res) {
    const { authEntity } = req;

    try {
      res.clearCookie('LaPaz_auth_token');
      return res.status(200).send({ login: false, data: authEntity });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  },
};
