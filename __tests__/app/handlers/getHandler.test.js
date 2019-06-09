const { newResObj } = require('../../test-utils');
const generateForm = require('../../../app/generateForm');
const getHandler = require('../../../app/handlers/getHandler');

jest.mock('../../../app/generateForm');

describe('getHandler', () => {
  test('main', () => {
    generateForm.mockImplementationOnce((x) => `${x}/`);

    const handler = getHandler('path1');
    expect(handler).toBeFunction();

    const res = newResObj();
    handler({}, res);

    expect(generateForm).toHaveBeenCalledTimes(1);
    expect(generateForm).toHaveBeenCalledWith('./path1');

    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith('./path1/');
  });
});
