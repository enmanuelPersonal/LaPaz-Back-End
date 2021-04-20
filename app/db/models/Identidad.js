'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Identidad = sequelize.define(
  'Identidad',
  {
    idIdentidad: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    serie: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {}
);

module.exports = Identidad;
