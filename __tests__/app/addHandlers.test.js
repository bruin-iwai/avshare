const { getHandler, postHandler } = require('../../app/handlers');
const addHandlers = require('../../app/addHandlers');

jest.mock('../../app/handlers');

describe('addHandlers', () => {
  test('main', () => {
    const app = {
      get: jest.fn(),
      post: jest.fn(),
    };

    const mockGetHandler = jest.fn((path) => `getHandler_${path}`);
    getHandler.mockImplementationOnce(mockGetHandler);

    const mockPostHandler = jest.fn((path, domain) => `postHandler_${path}_${domain}`);
    postHandler.mockImplementationOnce(mockPostHandler);

    addHandlers(app, 'path1', 'domain1');

    expect(app.get).toHaveBeenCalledTimes(1);
    expect(app.get).toHaveBeenCalledWith('/path1', 'getHandler_path1');
    expect(getHandler).toHaveBeenCalledTimes(1);
    expect(getHandler).toHaveBeenCalledWith('path1');

    expect(app.post).toHaveBeenCalledTimes(1);
    expect(app.post).toHaveBeenCalledWith('/path1', 'postHandler_path1_domain1');
    expect(postHandler).toHaveBeenCalledTimes(1);
    expect(postHandler).toHaveBeenCalledWith('path1', 'domain1');
  });
});
