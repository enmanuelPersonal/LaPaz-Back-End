'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Compra = sequelize.define(
  'Compra',
  {
    numCompra: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.INTEGER,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
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
