const { mockAwsPromise, mockS3GetObject } = require('../../__mocks__/aws-sdk');
const getParameterValue = require('../../app/getParameterValue');
const getSecretValue = require('../../app/getSecretValue');
const signUrl = require('../../app/signUrl');
const generateIndex = require('../../app/generateIndex');
const indexJson = require('./generateIndex.test.index');

jest.mock('../../app/getParameterValue');
jest.mock('../../app/getSecretValue');
jest.mock('../../app/signUrl');

describe('generateIndex', () => {
  beforeEach(() => {
    process.env.BUCKET_NAME = 'xxx';
  });

  afterEach(() => {
    delete process.env.BUCKET_NAME;
  });

  test('main', async () => {
    mockAwsPromise.mockResolvedValueOnce({
      Body: Buffer.from(JSON.stringify(indexJson)),
    });

    getParameterValue.mockResolvedValueOnce('keyPair1');
    getSecretValue.mockResolvedValueOnce('privateKey1');
    signUrl.mockImplementation((a) => `${a}/`);

    const html = await generateIndex('domain1', 'path1');

    expect(html).toEqual(`<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>My favorites</title>
</head>
<body>
<ul><li><a href="https://domain1/a.mp4/">aaaaa</a></li><li><a href="https://domain1/b.mp4/">bbb</a></li></ul></body></html>`);

    expect(mockS3GetObject).toHaveBeenCalledTimes(1);
    expect(mockS3GetObject).toHaveBeenCalledWith({
      Bucket: process.env.BUCKET_NAME,
      Key: `path1/index.json`,
    });

    expect(getParameterValue).toHaveBeenCalledTimes(1);
    expect(getParameterValue).toHaveBeenCalledWith('/avashare/CLOUDFRONT_KEY_PAIR_ID');

    expect(getSecretValue).toHaveBeenCalledTimes(1);
    expect(getSecretValue).toHaveBeenCalledWith('avshare-cloudfront-private-key.pem');

    expect(signUrl).toHaveBeenCalledTimes(2);
    expect(signUrl).toHaveBeenNthCalledWith(1, 'https://domain1/a.mp4', 'keyPair1', 'privateKey1');
    expect(signUrl).toHaveBeenNthCalledWith(2, 'https://domain1/b.mp4', 'keyPair1', 'privateKey1');
  });
});
