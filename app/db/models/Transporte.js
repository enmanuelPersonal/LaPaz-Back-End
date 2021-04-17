'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Transporte = sequelize.define(
  'Transporte',
  {
    idTransporte: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    hora: {
      allowNull: false,
      type: DataTypes.TIME,
    },
    status: {
      allowNull: false,
      type: DataTypes.TEXT,
      defaultValue: 'Proceso',
    },
  },
  {}
);

module.exports = Transporte;
