const mockAwsPromise = jest.fn();

const mockSSMGetParameter = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const SSM = jest.fn(() => ({
  getParameter: mockSSMGetParameter,
}));

const mockS3GetObject = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const S3 = jest.fn(() => ({
  getObject: mockS3GetObject,
}));

const mockSecretsManagerGetSecretValue = jest.fn(() => ({
  promise: mockAwsPromise,
}));

const SecretsManager = jest.fn(() => ({
  getSecretValue: mockSecretsManagerGetSecretValue,
}));

const mockCloudFrontSignerGetSignedUrl = jest.fn();

const CloudFront = {
  Signer: jest.fn(() => ({
    getSignedUrl: mockCloudFrontSignerGetSignedUrl,
  })),
};

module.exports = {
  mockAwsPromise,
  mockSSMGetParameter,
  SSM,
  mockS3GetObject,
  S3,
  mockSecretsManagerGetSecretValue,
  SecretsManager,
  mockCloudFrontSignerGetSignedUrl,
  CloudFront,
};
