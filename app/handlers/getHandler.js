const generateForm = require('../generateForm');

const getHandler = (path) => (req, res) => {
  const form = generateForm(`./${path}`);
  res.send(form);
};

module.exports = getHandler;
