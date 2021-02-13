'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Permisos = sequelize.define(
  'Permisos',
  {
    idPermiso: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    permiso: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: {
        msg: 'Ya ese Permiso existe',
      },
    },
  },
  {}
);

module.exports = Permisos;
