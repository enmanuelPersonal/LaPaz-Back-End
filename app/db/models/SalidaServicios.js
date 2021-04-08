'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const SalidaServicios = sequelize.define(
  'SalidaServicios',
  {
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {}
);

module.exports = SalidaServicios;
