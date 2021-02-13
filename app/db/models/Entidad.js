'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Entidad = sequelize.define(
  'Entidad',
  {
    idEntidad: {
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
    nacimiento: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Entidad;
