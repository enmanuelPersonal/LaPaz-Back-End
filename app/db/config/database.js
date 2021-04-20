const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('./config')[env];
const db = {};

let sequelize;

if (config.url) {
  sequelize = new Sequelize(config.url, config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

(async function () {
  try {
    await sequelize.authenticate();
    console.log(`Connected to the database`);
  } catch (error) {
    console.error(
      `Could not connect to the database`,
      error
    );
  }
})();

// sequelize
//   .sync({
//     logging: console.log,
//     force: true,
//   })
//   .then(() => console.log("conectado"))
//   .catch((error) => {
//     console.error("No se pudo conectar:", error);
//   });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
