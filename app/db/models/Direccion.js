'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Direccion = sequelize.define(
  'Direccion',
  {
    idDireccion: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
  },
  {}
);

module.exports = Direccion;
