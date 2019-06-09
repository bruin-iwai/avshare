const getParameterValue = require('../../app/getParameterValue');
const authenticate = require('../../app/authenticate');

jest.mock('../../app/getParameterValue');

describe('authenticate', () => {
  test('true', async () => {
    getParameterValue.mockResolvedValueOnce('aaa').mockResolvedValueOnce('bbb');

    const actual = await authenticate({
      body: {
        username: 'aaa',
        password: 'bbb',
      },
    });

    expect(actual).toBeTruthy();

    expect(getParameterValue).toHaveBeenCalledTimes(2);
    expect(getParameterValue).toHaveBeenNthCalledWith(1, '/avshare/MYNAME');
    expect(getParameterValue).toHaveBeenNthCalledWith(2, '/avshare/MYPASS');
  });

  test('false', async () => {
    getParameterValue.mockResolvedValueOnce('xxx').mockResolvedValueOnce('bbb');

    const actual = await authenticate({
      body: {
        username: 'aaa',
        password: 'bbb',
      },
    });

    expect(actual).toBeFalsy();

    expect(getParameterValue).toHaveBeenCalledTimes(2);
    expect(getParameterValue).toHaveBeenNthCalledWith(1, '/avshare/MYNAME');
    expect(getParameterValue).toHaveBeenNthCalledWith(2, '/avshare/MYPASS');
  });
});
