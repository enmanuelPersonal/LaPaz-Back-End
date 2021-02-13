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
      unique: {
        msg: 'Ya ese Ciudad existe',
      },
    },
  },
  {}
);

module.exports = Ciudad;
