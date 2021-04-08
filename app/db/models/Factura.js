'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Factura = sequelize.define(
  'Factura',
  {
    numFactura: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    total: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    NFC: {
      type: DataTypes.TEXT,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Factura;
