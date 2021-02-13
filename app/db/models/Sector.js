'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Sector = sequelize.define(
  'Sector',
  {
    idSector: {
      allowNull: false,
      autoIncrement: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      type: DataTypes.UUID,
      unique: true,
    },
    descripcion: {
      allowNull: false,
      type: DataTypes.TEXT,
      unique: {
        msg: 'Ya ese Sector existe',
      },
    },
  },
  {}
);

module.exports = Sector;
