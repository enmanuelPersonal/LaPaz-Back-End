require('dotenv').config();

const {
  DB_NAME: database,
  DB_USER: username,
  DB_PASSWORD: password,
  DB_HOST,
} = process.env;

const BASE_CONFIG = {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: { freezeTableName: true },
};

const DB_URL = Object.assign(
  {},
  { database, username, password },
  { BASE_CONFIG }
);

module.exports = {
  development: DB_URL,
  staging: DB_URL,
  production: DB_URL,
};
