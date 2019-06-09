const { getHandler, postHandler } = require('./handlers');

module.exports = function addHandlers(app, path, domain) {
  app.get(`/${path}`, getHandler(path));
  app.post(`/${path}`, postHandler(path, domain));
};
