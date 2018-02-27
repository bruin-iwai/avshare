'use strict';

const common = require('./common');

function addHandlers(app) {
  app.get('/old-programs', (req, res) => {
    const form = common.generateForm('./old-programs');
    res.send(form);
  });

  app.post('/old-programs', (req, res) => {
    if (!common.authenticate(req)) {
      return res.sendStatus(403);
    }

    const signedUrl = common.signUrl(process.env.OLD_PROGRAMS_DOMAIN);
    res.redirect(signedUrl);
  });
}

module.exports = {
  addHandlers
};
