const debug = require('debug')('my:signUrl');
const moment = require('moment');
const signer = require('aws-cloudfront-sign');

module.exports = function signUrl(baseUrl, keypairId, privateKeyString) {
  const expireTime = moment().add(1, 'day');
  const signingOptions = {
    keypairId,
    privateKeyString,
    expireTime,
  };
  const signedUrl = signer.getSignedUrl(baseUrl, signingOptions);
  debug('signedUrl: %s', signedUrl);
  return signedUrl;
};
