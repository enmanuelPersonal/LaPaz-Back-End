'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const DetalleFactura = sequelize.define(
  'DetalleFactura',
  {
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    precio: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
  },
  {}
);

module.exports = DetalleFactura;
