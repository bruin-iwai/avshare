const AWS = require('aws-sdk');
const debug = require('debug')('my:common');
const moment = require('moment');
const signer = require('aws-cloudfront-sign');

const ssm = new AWS.SSM();
const s3 = new AWS.S3();

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

const getParameterValue = (name) =>
  ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .then((ret) => ret.Parameter.Value);

const authenticate = async (req) => {
  debug(req.body);
  const { username, password } = req.body;

  const myname = await getParameterValue('/avshare/MYNAME');
  const mypass = await getParameterValue('/avshare/MYPASS');

  return username === myname && password === mypass;
};

function signUrl(baseUrl, keypairId) {
  debug(process.env.CLOUDFRONT_PRIVATE_KEY_STRING);
  const expireTime = moment().add(1, 'day');
  const signingOptions = {
    keypairId,
    privateKeyString: process.env.CLOUDFRONT_PRIVATE_KEY_STRING,
    expireTime,
  };
  const signedUrl = signer.getSignedUrl(baseUrl, signingOptions);
  debug('signedUrl: %s', signedUrl);
  return signedUrl;
}

const generateIndex = async (domain, path) => {
  const raw = await s3
    .getObject({
      Bucket: process.env.BUCKET_NAME,
      Key: `${path}/index.json`,
    })
    .promise()
    .then((data) => data.Body);

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

  const keypairId = await getParameterValue('/avashare/CLOUDFRONT_KEY_PAIR_ID');
  const liTags = await Promise.all(
    data.files.map((v) =>
      signUrl(`https://${domain}/${v.file}`, keypairId).then((signedUrl) => {
        debug('signedUrl: %s', signedUrl);
        return `<li><a href="${signedUrl}">${v.title}</a></li>`;
      })
    )
  );
  index += liTags.join('');

  index += '</ul>';
  index += '</body>';
  index += '</html>';
  return index;
};

function addHandlers(app, path, domain) {
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
}

module.exports = {
  addHandlers,
};
