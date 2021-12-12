"use strict";

const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const ProductoLog = sequelize.define(
  "ProductoLog",
  {
    idProductoLog: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    stock: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    costo: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    precio: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    reorden: {
      allowNull: false,
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
    cantCompra: {
      allowNull: true,
      type: DataTypes.INTEGER,
      defaultValue: 10,
    },
  },
  {}
);

module.exports = ProductoLog;
