'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Suplidor = sequelize.define(
  'Suplidor',
  {
    idSuplidor: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {}
);

module.exports = Suplidor;
