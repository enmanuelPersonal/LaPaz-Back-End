const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config.BASE_CONFIG
);

(async function () {
  try {
    await sequelize.authenticate();
    console.log(`Connected to the database ${config.database}`);
  } catch (error) {
    console.error(
      `Could not connect to the database ${config.database}:`,
      error
    );
  }
})();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
