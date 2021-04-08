'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Compra = sequelize.define(
  'Compra',
  {
    numCompra: {
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
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Compra;
