'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Almacen = sequelize.define(
  'Almacen',
  {
    idAlmacen: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    nombre: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    capacidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Almacen;
