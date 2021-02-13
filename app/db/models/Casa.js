'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Casa = sequelize.define(
  'Casa',
  {
    idCasa: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    numero: {
      allowNull: false,
      type: DataTypes.INTEGER,
      unique: {
        msg: 'Ya ese numero de Casa existe',
      },
    },
    referencia: {
      allowNull: true,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Casa;
