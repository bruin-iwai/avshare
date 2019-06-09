const expectedGetHandler = require('../../../app/handlers/getHandler');
const expectedPostHandler = require('../../../app/handlers/postHandler');
const { getHandler, postHandler } = require('../../../app/handlers');

describe('handlers/index', () => {
  test('main', () => {
    expect(getHandler).toBe(expectedGetHandler);
    expect(postHandler).toBe(expectedPostHandler);
  });
});
