const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();

module.exports = async function getSecretValue(name) {
  return secretsManager
    .getSecretValue({
      SecretId: name,
    })
    .promise()
    .then((data) => Buffer.from(data.SecretBinary, 'base64').toString('ascii'));
};
