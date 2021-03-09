'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const ImagenProducto = sequelize.define(
  'ImagenProducto',
  {
    idImagenProducto: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    url: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = ImagenProducto;
