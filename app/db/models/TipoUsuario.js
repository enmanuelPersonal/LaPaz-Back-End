'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const TipoUsuario = sequelize.define(
  'TipoUsuario',
  {
    idTipoUsuario: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    tipo: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {}
);

module.exports = TipoUsuario;
