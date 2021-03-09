'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Difunto = sequelize.define(
  'Difunto',
  {
    idDifunto: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    actaDef: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {}
);

module.exports = Difunto;
