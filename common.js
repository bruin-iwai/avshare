'use strict';

const debug = require('debug')('my:common');
const moment = require('moment');
const signer = require('aws-cloudfront-sign');

function generateForm(path) {
  const form = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>Login form</title>
</head>
<body>
<form action="${path}" method="POST">
  <table>
    <tbody>
      <tr>
        <td>ユーザ名：</td>
        <td><input id="username" type="text" name="username" width="10"></td>
      </tr>
      <tr>
        <td>パスワード：</td>
        <td><input id="password" type="password" name="password" width="10"></td>
      </tr>
    </tbody>
  </table>
  <button type="submit">ログイン</button>
</form>
</body>
</html>`;
  return form;
}

function authenticate(req) {
  debug(req.body);
  const username = req.body.username;
  const password = req.body.password;
  return username === process.env.MYNAME && password === process.env.MYPASS;
}

function signUrl(domain) {
  debug(process.env.CLOUDFRONT_PRIVATE_KEY_STRING);
  const expireTime = moment().utc().add(1, 'day');
  const signingOptions = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY_STRING,
    expireTime
  };
  const signedUrl = signer.getSignedUrl(`https://${domain}/index.html`, signingOptions);
  debug('signedUrl: %s', signedUrl);
  return signedUrl;
}

module.exports = {
  generateForm,
  authenticate,
  signUrl
};
