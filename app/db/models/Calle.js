'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Calle = sequelize.define(
  'Calle',
  {
    idCalle: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {}
);

module.exports = Calle;
