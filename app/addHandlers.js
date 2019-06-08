const generateForm = require('./generateForm');
const authenticate = require('./authenticate');
const generateIndex = require('./generateIndex');

module.exports = function addHandlers(app, path, domain) {
  app.get(`/${path}`, (req, res) => {
    const form = generateForm(`./${path}`);
    res.send(form);
  });

  app.post(`/${path}`, (req, res) => {
    authenticate(req).then((isAuthenticated) => {
      if (!isAuthenticated) {
        res.sendStatus(403);
        return;
      }

      generateIndex(domain, path)
        .then((html) => res.send(html))
        .catch((err) => res.status(500).send(err));
    });
  });
};
