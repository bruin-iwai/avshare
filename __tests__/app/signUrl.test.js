const moment = require('moment');
const { CloudFront, mockCloudFrontSignerGetSignedUrl } = require('../../__mocks__/aws-sdk');
const signUrl = require('../../app/signUrl');

jest.mock('moment');

describe('signUrl', () => {
  test('main', () => {
    moment.utc.mockImplementationOnce(() => jest.requireActual('moment').utc([2019, 5, 8]));

    mockCloudFrontSignerGetSignedUrl.mockReturnValueOnce('http://hogehoge?sign=1');

    const actual = signUrl('https://hogehoge', 'keyPair', 'privateKey');

    expect(actual).toEqual('http://hogehoge?sign=1');

    expect(mockCloudFrontSignerGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(mockCloudFrontSignerGetSignedUrl).toHaveBeenCalledWith({
      url: 'https://hogehoge',
      expires: 1560038400,
    });

    expect(CloudFront.Signer).toHaveBeenCalledTimes(1);

    // なぜか mockConstructor に対して toHaveBeenCalledwith() が定義されていないので(バグ？)
    // mock.calls を直接検証する
    // expect(CloudFront.Signer).toHaveBeenCalledwith('keyPair', 'privateKey');
    expect(CloudFront.Signer.mock.calls[0]).toEqual(['keyPair', 'privateKey']);
  });
});
