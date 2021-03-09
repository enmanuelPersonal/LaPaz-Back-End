'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Categoria = sequelize.define(
  'Categoria',
  {
    idCategoria: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    categoria: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: true,
    },
  },
  {}
);

module.exports = Categoria;
