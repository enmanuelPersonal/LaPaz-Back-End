'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Mensualidad = sequelize.define(
  'Mensualidad',
  {
    idMensualidad: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    monto: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    meses: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Mensualidad;
