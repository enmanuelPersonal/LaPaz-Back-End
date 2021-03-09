'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const HistorialSuscripcion = sequelize.define(
  'HistorialSuscripcion',
  {
    fecha: {
      allowNull: false,
      defaultValue: DataTypes.DATE,
      type: DataTypes.DATE,
    },
  },
  {}
);

module.exports = HistorialSuscripcion;
