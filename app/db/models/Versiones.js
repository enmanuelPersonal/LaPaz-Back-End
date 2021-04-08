'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Versiones = sequelize.define(
  'Versiones',
  {
    idVersion: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    mayor: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    menor: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    revision: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    fechaFin: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {}
);

module.exports = Versiones;
