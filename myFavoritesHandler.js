'use strict';

const common = require('./common');
const debug = require('debug')('my:myFavoritesHandler');

function addHandlers(app) {
  app.get('/my-favorites', (req, res) => {
    const form = common.generateForm('./my-favorites');
    res.send(form);
  });

  app.post('/my-favorites', (req, res) => {
    debug(req.body);
    const username = req.body.username;
    const password = req.body.password;
    if (username !== process.env.MYNAME || password !== process.env.MYPASS) {
      res.sendStatus(403);
      return;
    }

    const signedUrl = common.signUrl(process.env.MY_FAVORITES_DOMAIN);
    res.redirect(signedUrl);
  });
}

module.exports = {
  addHandlers
};
