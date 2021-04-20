'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const TipoPlan = sequelize.define(
  'TipoPlan',
  {
    idTipoPlan: {
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
    monto: {
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

module.exports = TipoPlan;
