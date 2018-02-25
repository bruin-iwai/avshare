'use strict';

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug')('my:index');
const signer = require('aws-cloudfront-sign');
const moment = require('moment');

const app = express();

process.env.CLOUDFRONT_PRIVATE_KEY_STRING = process.env.CLOUDFRONT_PRIVATE_KEY_STRING.replace(/\\n/g, '\n');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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

app.get('/old-programs', (req, res) => {
  const form = generateForm('./old-programs');
  res.send(form);
});

app.get('/my-favorites', (req, res) => {
  const form = generateForm('./my-favorites');
  res.send(form);
});

function signUrl(res, domain) {
  debug(process.env.CLOUDFRONT_PRIVATE_KEY_STRING);
  const expireTime = moment().utc().add(1, 'day');
  const signingOptions = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY_STRING,
    expireTime
  };
  const signedCookies = signer.getSignedCookies(`https://${domain}/*`, signingOptions);
  for (const cookieId in signedCookies) {
    debug('signedCookies[%s]: %s', cookieId, signedCookies[cookieId]);
  }
  const cookieOptions = {
    domain,
    path: '/',
    httpOnly: true,
    secure: true
  };
  res.cookie('CloudFront-Signature', signedCookies['CloudFront-Signature'], cookieOptions);
  res.cookie('CloudFront-Key-Pair-Id', process.env.CLOUDFRONT_KEY_PAIR_ID, cookieOptions);
  res.cookie('CloudFront-Expires', String(expireTime.unix()), cookieOptions);
}

app.post('/old-programs', (req, res) => {
  debug(req.body);
  const username = req.body.username;
  const password = req.body.password;
  if (username !== process.env.MYNAME || password !== process.env.MYPASS) {
    res.sendStatus(403);
    return;
  }
  // res.json(req.body);

  signUrl(res, process.env.OLD_PROGRAMS_DOMAIN);
  res.redirect(`https://${process.env.OLD_PROGRAMS_DOMAIN}`);
});

app.post('/my-favorites', (req, res) => {
  debug(req.body);
  const username = req.body.username;
  const password = req.body.password;
  if (username !== process.env.MYNAME || password !== process.env.MYPASS) {
    res.sendStatus(403);
    return;
  }
  // res.json(req.body);

  signUrl(res, process.env.MY_FAVORITES_DOMAIN);
  res.redirect(`https://${process.env.MY_FAVORITES_DOMAIN}`);
});

module.exports.handler = serverless(app);
