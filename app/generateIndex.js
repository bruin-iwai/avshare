const AWS = require('aws-sdk');
const debug = require('debug')('my:generateIndex');
const getParameterValue = require('./getParameterValue');
const getSecretValue = require('./getSecretValue');
const signUrl = require('./signUrl');

const s3 = new AWS.S3();

module.exports = async function generateIndex(domain, path) {
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
  const privateKeyString = await getSecretValue('avshare-cloudfront-private-key.pem');
  index += data.files
    .map((v) => {
      const signedUrl = signUrl(`https://${domain}/${v.file}`, keypairId, privateKeyString);
      debug('signedUrl: %s', signedUrl);
      return `<li><a href="${signedUrl}">${v.title}</a></li>`;
    })
    .join('');

  index += '</ul>';
  index += '</body>';
  index += '</html>';
  return index;
};
