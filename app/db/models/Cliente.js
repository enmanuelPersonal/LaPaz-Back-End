'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Cliente = sequelize.define(
  'Cliente',
  {
    idCliente: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
  },
  {}
);

module.exports = Cliente;
