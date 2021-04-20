'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Telefono = sequelize.define(
  'Telefono',
  {
    idTelefono: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    telefono: {
      allowNull: false,
      type: DataTypes.STRING(10),
    },
  },
  {}
);

module.exports = Telefono;
