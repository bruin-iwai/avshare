const AWS = require('aws-sdk');

const ssm = new AWS.SSM();

module.exports = async function getParameterValue(name) {
  return ssm
    .getParameter({
      Name: name,
      WithDecryption: true,
    })
    .promise()
    .then((ret) => ret.Parameter.Value);
};
