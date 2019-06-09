const bodyParser = require('body-parser');
const express = require('express');
const addHandlers = require('./addHandlers');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

addHandlers(app, 'my-favorites', process.env.MY_FAVORITES_DOMAIN);
addHandlers(app, 'old-programs', process.env.OLD_PROGRAMS_DOMAIN);

module.exports = app;
