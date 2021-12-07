"use strict";

const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const Pedido = sequelize.define(
  "Pedido",
  {
    numPedido: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      unique: true,
    },
    total: {
      allowNull: false,
      type: DataTypes.DOUBLE,
    },
    status: {
      allowNull: false,
      type: DataTypes.TEXT,
      defaultValue: true,
    },
    fechaEntrega: {
      allowNull: true,
      type: DataTypes.DATE,
    },
  },
  {}
);

module.exports = Pedido;
