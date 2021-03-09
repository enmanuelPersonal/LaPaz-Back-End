'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Suscripcion = sequelize.define(
  'Suscripcion',
  {
    idSuscripcion: {
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
    status: {
      allowNull: false,
      type: DataTypes.TEXT,
      defaultValue: 'Espera',
    },
  },
  {}
);

module.exports = Suscripcion;
