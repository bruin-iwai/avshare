const app = require('../app');
const { handler } = require('../');

jest.mock('serverless-http', () => (x) => x);
jest.mock('../app');

describe('index', () => {
  test('main', () => {
    expect(handler).toBe(app);
  });
});
