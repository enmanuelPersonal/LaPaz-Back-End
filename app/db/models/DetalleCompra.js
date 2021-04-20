'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const DetalleCompra = sequelize.define(
  'DetalleCompra',
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

module.exports = DetalleCompra;
