const { newResObj } = require('../../test-utils');
const authenticate = require('../../../app/authenticate');
const generateIndex = require('../../../app/generateIndex');
const postHandler = require('../../../app/handlers/postHandler');

jest.mock('../../../app/authenticate');
jest.mock('../../../app/generateIndex');

describe('postHandler', () => {
  test('authenticate->true, generateIndex->normal', async () => {
    authenticate.mockResolvedValueOnce(true);
    generateIndex.mockResolvedValueOnce('html1');

    const handler = postHandler('path1', 'domain1');
    expect(handler).toBeFunction();

    const res = newResObj();
    await handler({}, res);

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(authenticate).toHaveBeenCalledWith({});

    expect(generateIndex).toHaveBeenCalledTimes(1);
    expect(generateIndex).toHaveBeenCalledWith('domain1', 'path1');

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith('html1');
  });

  test('authenticate->true, generateIndex->error', async () => {
    authenticate.mockResolvedValueOnce(true);
    generateIndex.mockRejectedValueOnce('err1');

    const handler = postHandler('path1', 'domain1');
    expect(handler).toBeFunction();

    const res = newResObj();
    await handler({}, res);

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(authenticate).toHaveBeenCalledWith({});

    expect(generateIndex).toHaveBeenCalledTimes(1);
    expect(generateIndex).toHaveBeenCalledWith('domain1', 'path1');

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith('err1');
  });

  test('authenticate->false', async () => {
    authenticate.mockResolvedValueOnce(false);

    const handler = postHandler('path1', 'domain1');
    expect(handler).toBeFunction();

    const res = newResObj();
    await handler({}, res);

    expect(authenticate).toHaveBeenCalledTimes(1);
    expect(authenticate).toHaveBeenCalledWith({});

    expect(generateIndex).not.toHaveBeenCalled();

    expect(res.sendStatus).toHaveBeenCalledTimes(1);
    expect(res.sendStatus).toHaveBeenCalledWith(403);
  });
});
