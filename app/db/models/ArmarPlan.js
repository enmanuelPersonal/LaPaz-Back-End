'use strict';

const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const ArmarPlan = sequelize.define(
  'ArmarPlan',
  {
    cantidad: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
  },
  {}
);

module.exports = ArmarPlan;
