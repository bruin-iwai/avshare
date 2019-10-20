const AWSXRay = require('aws-xray-sdk');
AWSXRay.captureHTTPsGlobal(require('http'));
AWSXRay.captureHTTPsGlobal(require('https'));
const bodyParser = require('body-parser');
const express = require('express');
const addHandlers = require('./addHandlers');

const app = express();

app.use(AWSXRay.express.openSegment('avshare'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

addHandlers(app, 'my-favorites', process.env.MY_FAVORITES_DOMAIN);
addHandlers(app, 'old-programs', process.env.OLD_PROGRAMS_DOMAIN);

app.use(AWSXRay.express.closeSegment());

module.exports = app;
