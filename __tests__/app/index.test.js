const request = require('supertest');

jest.mock('../../app/addHandlers', () => (appl, path, domain) => {
  appl.get(`/${path}`, (req, res) => res.json({ domain }));
});

describe('app/index', () => {
  beforeEach(() => {
    process.env.MY_FAVORITES_DOMAIN = 'MY_FAVORITES_DOMAIN';
    process.env.OLD_PROGRAMS_DOMAIN = 'OLD_PROGRAMS_DOMAIN';
  });

  afterEach(() => {
    delete process.env.MY_FAVORITES_DOMAIN;
    delete process.env.OLD_PROGRAMS_DOMAIN;
  });

  test('root', async () => {
    // 環境変数を定義してから require する必要があるので global-require を無効化
    // eslint-disable-next-line global-require
    const app = require('../../app');
    const res = await request(app).get('/');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual('Hello World!');
  });

  test('my-favorites', async () => {
    // 環境変数を定義してから require する必要があるので global-require を無効化
    // eslint-disable-next-line global-require
    const app = require('../../app');
    const res = await request(app).get('/my-favorites');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual(JSON.stringify({ domain: 'MY_FAVORITES_DOMAIN' }));
  });

  test('old-programs', async () => {
    // 環境変数を定義してから require する必要があるので global-require を無効化
    // eslint-disable-next-line global-require
    const app = require('../../app');
    const res = await request(app).get('/old-programs');
    expect(res.status).toEqual(200);
    expect(res.text).toEqual(JSON.stringify({ domain: 'OLD_PROGRAMS_DOMAIN' }));
  });
});
