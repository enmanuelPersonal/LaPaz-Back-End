'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const TipoPago = sequelize.define(
  'TipoPago',
  {
    idTipoPago: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    tipo: {
      allowNull: false,
      type: DataTypes.TEXT,
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

module.exports = TipoPago;
