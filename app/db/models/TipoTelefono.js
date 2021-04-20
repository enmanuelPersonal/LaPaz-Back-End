'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const TipoTelefono = sequelize.define(
  'TipoTelefono',
  {
    idTipoTelefono: {
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

module.exports = TipoTelefono;
