'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Sexo = sequelize.define(
  'Sexo',
  {
    idSexo: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    sexo: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Sexo;
