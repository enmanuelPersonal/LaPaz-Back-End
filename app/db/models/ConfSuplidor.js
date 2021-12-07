"use strict";

const { sequelize } = require("../config/database");
const { DataTypes } = require("sequelize");

const ConfSuplidor = sequelize.define(
  "ConfSuplidor",
  {
    idConfSuplidor: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    validacion: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    isRequerido: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
  },
  {}
);

module.exports = ConfSuplidor;
