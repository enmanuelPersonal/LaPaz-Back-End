'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Modelo = sequelize.define(
  'Modelo',
  {
    idModelo: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    modelo: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Modelo;
