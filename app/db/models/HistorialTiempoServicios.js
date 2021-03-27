'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const HistorialTiempoServicios = sequelize.define(
  'HistorialTiempoServicios',
  {
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {}
);

module.exports = HistorialTiempoServicios;
