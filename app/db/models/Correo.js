'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Correo = sequelize.define(
  'Correo',
  {
    idCorreo: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    correo: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: {
        msg: 'Ya ese Email existe',
      },
      validate: {
        isEmail: {
          msg: 'Email no valido',
        },
      },
    },
  },
  {}
);

module.exports = Correo;
