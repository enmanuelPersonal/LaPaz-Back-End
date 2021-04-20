'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Itebis = sequelize.define(
  'Itebis',
  {
    idItebis: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    porcentaje: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
  },
  {}
);

module.exports = Itebis;
