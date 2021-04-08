'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const TipoIdentidad = sequelize.define(
  'TipoIdentidad',
  {
    idTipoIdentidad: {
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

module.exports = TipoIdentidad;
