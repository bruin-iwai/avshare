'use strict';

const AWS = require('aws-sdk');
const debug = require('debug')('my:common');
const moment = require('moment');
const signer = require('aws-cloudfront-sign');

function generateForm(path) {
  const form = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
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

function signUrl(baseUrl) {
  debug(process.env.CLOUDFRONT_PRIVATE_KEY_STRING);
  const expireTime = moment().utc().add(1, 'day');
  const signingOptions = {
    keypairId: process.env.CLOUDFRONT_KEY_PAIR_ID,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY_STRING,
    expireTime
  };
  const signedUrl = signer.getSignedUrl(baseUrl, signingOptions);
  debug('signedUrl: %s', signedUrl);
  return signedUrl;
}

function generateIndex(domain, path) {
  const s3 = new AWS.S3();
  return s3.getObject({
    Bucket: process.env.BUCKET_NAME,
    Key: `${path}/index.json`
  }).promise().then(data => data.Body).then(raw => {
    debug(raw);
    const data = JSON.parse(raw);

    let index = `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.title}</title>
</head>
<body>
<ul>`;

    data.files.forEach(v => {
      const signedUrl = signUrl(`https://${domain}/${v.file}`);
      debug('signedUrl: %s', signedUrl);
      index += `<li><a href="${signedUrl}">${v.title}</a></li>`;
    });

    index += '</ul>';
    index += '</body>';
    index += '</html>';
    return index;
  });
}

function addHandlers(app, path, domain) {
  app.get(`/${path}`, (req, res) => {
    const form = generateForm(`./${path}`);
    res.send(form);
  });

  app.post(`/${path}`, (req, res) => {
    if (!authenticate(req)) {
      return res.sendStatus(403);
    }

    generateIndex(domain, path)
      .then(html => res.send(html))
      .catch(err => res.status(500).send(err));
  });
}

module.exports = {
  addHandlers
};
