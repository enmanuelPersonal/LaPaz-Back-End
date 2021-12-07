'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const DetallePedido = sequelize.define(
  'DetallePedido',
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

module.exports = DetallePedido;
