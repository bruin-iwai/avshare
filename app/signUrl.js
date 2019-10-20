const AWSXRay = require('aws-xray-sdk');
const AWS = AWSXRay.captureAWS(require('aws-sdk'));
const debug = require('debug')('my:signUrl');
const moment = require('moment');

module.exports = function signUrl(url, keyPairId, privateKey) {
  const expires = moment
    .utc()
    .add(1, 'days')
    .unix();
  const signer = new AWS.CloudFront.Signer(keyPairId, privateKey);
  const signedUrl = signer.getSignedUrl({
    url,
    expires,
  });
  debug('signedUrl: %s', signedUrl);
  return signedUrl;
};
