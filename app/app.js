const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const routes = require('./api/routes');
const { COOKIE_SECRET } = process.env;

const app = express();

app.use(express.static(path.join(__dirname, 'public/')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(COOKIE_SECRET));
app.use(cors());
app.use(helmet());
app.use(routes);

module.exports = app;
