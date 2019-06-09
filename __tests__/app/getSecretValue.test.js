const { mockAwsPromise, mockSecretsManagerGetSecretValue } = require('../../__mocks__/aws-sdk');
const getSecretValue = require('../../app/getSecretValue');

describe('getSecretValue', () => {
  test('main', async () => {
    mockAwsPromise.mockResolvedValueOnce({
      SecretBinary: Buffer.from('12345', 'ascii').toString('base64'),
    });

    const actual = await getSecretValue('name');

    expect(actual).toEqual('12345');

    expect(mockSecretsManagerGetSecretValue).toHaveBeenCalledTimes(1);
    expect(mockSecretsManagerGetSecretValue).toHaveBeenCalledWith({
      SecretId: 'name',
    });
  });
});
