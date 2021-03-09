'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Cargo = sequelize.define(
  'Cargo',
  {
    idCargo: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    cargo: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
    salario: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
  },
  {}
);

module.exports = Cargo;
