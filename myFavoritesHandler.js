'use strict';

const common = require('./common');

function addHandlers(app) {
  app.get('/my-favorites', (req, res) => {
    const form = common.generateForm('./my-favorites');
    res.send(form);
  });

  app.post('/my-favorites', (req, res) => {
    if (!common.authenticate(req)) {
      return res.sendStatus(403);
    }

    const signedUrl = common.signUrl(process.env.MY_FAVORITES_DOMAIN);
    res.redirect(signedUrl);
  });
}

module.exports = {
  addHandlers
};
