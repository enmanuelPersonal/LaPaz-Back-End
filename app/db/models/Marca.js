'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Marca = sequelize.define(
  'Marca',
  {
    idMarca: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    marca: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Marca;
