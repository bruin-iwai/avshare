const debug = require('debug')('my:authenticate');
const getParameterValue = require('./getParameterValue');

module.exports = async function authenticate(req) {
  debug(req.body);
  const { username, password } = req.body;

  const myname = await getParameterValue('/avshare/MYNAME');
  const mypass = await getParameterValue('/avshare/MYPASS');

  return username === myname && password === mypass;
};
