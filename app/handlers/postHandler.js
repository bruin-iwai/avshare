const authenticate = require('../authenticate');
const generateIndex = require('../generateIndex');

const postHandler = (path, domain) => (req, res) =>
  authenticate(req).then((isAuthenticated) => {
    if (!isAuthenticated) {
      res.sendStatus(403);
      return Promise.resolve();
    }

    return generateIndex(domain, path)
      .then((html) => res.send(html))
      .catch((err) => res.status(500).send(err));
  });

module.exports = postHandler;
