'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const myFavoritesHandler = require('./myFavoritesHandler');
const oldProgramsHandler = require('./oldProgramsHandler');
const serverless = require('serverless-http');

const app = express();

process.env.CLOUDFRONT_PRIVATE_KEY_STRING = process.env.CLOUDFRONT_PRIVATE_KEY_STRING.replace(/\\n/g, '\n');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

myFavoritesHandler.addHandlers(app);
oldProgramsHandler.addHandlers(app);

module.exports.handler = serverless(app);
