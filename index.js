const bodyParser = require('body-parser');
const common = require('./common');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

process.env.CLOUDFRONT_PRIVATE_KEY_STRING = process.env.CLOUDFRONT_PRIVATE_KEY_STRING.replace(/\\n/g, '\n');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

common.addHandlers(app, 'my-favorites', process.env.MY_FAVORITES_DOMAIN);
common.addHandlers(app, 'old-programs', process.env.OLD_PROGRAMS_DOMAIN);

module.exports.handler = serverless(app);
