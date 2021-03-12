require('dotenv').config();

const {
  PG_URI,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  PG_PORT = 5432,
} = process.env;

const PG_URL =
  PG_URI ||
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${PG_PORT}/${DB_NAME}`;

const BASE_CONFIG = {
  dialect: 'postgres',
  url: PG_URL,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  define: { freezeTableName: true },
};

module.exports = {
  development: BASE_CONFIG,
  staging: BASE_CONFIG,
  production: Object.assign({}, BASE_CONFIG, {
    dialectOptions: {
      ssl: { require: true },
    },
    ssl: true,
  }),
};
