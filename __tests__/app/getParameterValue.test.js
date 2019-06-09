const { mockAwsPromise, mockSSMGetParameter } = require('../../__mocks__/aws-sdk');
const getParameterValue = require('../../app/getParameterValue');

describe('getParameterValue', () => {
  test('main', async () => {
    mockAwsPromise.mockResolvedValueOnce({
      Parameter: {
        Value: 'Tom',
      },
    });

    const actual = await getParameterValue('Hello');

    expect(actual).toEqual('Tom');

    expect(mockSSMGetParameter).toHaveBeenCalledTimes(1);
    expect(mockSSMGetParameter).toHaveBeenCalledWith({
      Name: 'Hello',
      WithDecryption: true,
    });
  });
});
