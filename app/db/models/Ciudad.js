'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Ciudad = sequelize.define(
  'Ciudad',
  {
    idCiudad: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Ciudad;
