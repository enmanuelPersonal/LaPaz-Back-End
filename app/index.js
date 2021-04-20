const app = require('./app');
require('dotenv').config();
require('./db/config/database');

const port = process.env.PORT;

async function main() {
  await app.set('port', port);
  await app.listen(app.get('port'));
  console.log(`🚀Server Running on: http://localhost:${port}`);
}

main();
