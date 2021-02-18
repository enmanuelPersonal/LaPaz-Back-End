'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const Usuario = sequelize.define(
  'Usuario',
  {
    idUsuario: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    usuario: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    password: {
      allowNull: false,
      type: DataTypes.TEXT,
      validate: {
        min: {
          args: 8,
          msg: 'password debe ser mayor de 8 digitos',
        },
      },
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        const salt = await bcrypt.genSalt(10),
          hashedPwd = await bcrypt.hash(user.password, salt);

        Object.assign(user, {
          password: hashedPwd,
        });
      },
    },
  }
);

module.exports = Usuario;
