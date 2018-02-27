'use strict';

const common = require('./common');
const debug = require('debug')('my:oldProgramsHandler');

function addHandlers(app) {
  app.get('/old-programs', (req, res) => {
    const form = common.generateForm('./old-programs');
    res.send(form);
  });

  app.post('/old-programs', (req, res) => {
    debug(req.body);
    const username = req.body.username;
    const password = req.body.password;
    if (username !== process.env.MYNAME || password !== process.env.MYPASS) {
      res.sendStatus(403);
      return;
    }

    const signedUrl = common.signUrl(process.env.OLD_PROGRAMS_DOMAIN);
    res.redirect(signedUrl);
  });
}

module.exports = {
  addHandlers
};
