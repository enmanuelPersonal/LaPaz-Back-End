'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Persona = sequelize.define(
  'Persona',
  {
    idPersona: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    apellido: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
  },
  {}
);

module.exports = Persona;
