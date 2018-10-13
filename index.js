const bodyParser = require('body-parser');
const express = require('express');
const serverless = require('serverless-http');
const common = require('./common');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

common.addHandlers(app, 'my-favorites', process.env.MY_FAVORITES_DOMAIN);
common.addHandlers(app, 'old-programs', process.env.OLD_PROGRAMS_DOMAIN);

module.exports.handler = serverless(app);
