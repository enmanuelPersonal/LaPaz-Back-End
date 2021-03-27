'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const EntradaServicios = sequelize.define(
  'EntradaServicios',
  {
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {}
);

module.exports = EntradaServicios;
