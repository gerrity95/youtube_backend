const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDb');

jest.mock('../../src/middleware/authenticate', () => ({
  verifyToken: (_, __, next) => next(),
}));
jest.mock('../../src/middleware/authorize', () => ({
  verifyUser: (_) => (_, __, next) => next(),
}));
jest.mock('../../src/services/youtube.service', () => ({
  search: jest.fn()
}))
const { search } = require('../../src/services/youtube.service');

setupTestDB();

describe('YouTube routes', () => {
  describe('GET /youtube/search', () => {

    afterAll(() => {
      jest.clearAllMocks();
    })

    test('should return 201 and successfully return results', async () => {
      search.mockReturnValue({
        channel: 'channel',
        title: 'title',
        link: `https://www.youtube.com/watch?v=randomID`,
        views: 10000
      })
      
      const searchQuery = {search_query: "Hello World"};
      const res = await request(app)
        .get('/youtube/search')
        .send(searchQuery)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        channel: 'channel',
        title: 'title',
        link: `https://www.youtube.com/watch?v=randomID`,
        views: 10000
      });

    });

    test('should return 401 error if search query is not defined', async () => {
      await request(app).get('/youtube/search').expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if scope is malformed', async () => {
      const scope = {search_query: ['wrong format']};
      await request(app).get('/youtube/search').send(scope).expect(httpStatus.BAD_REQUEST);
    });
  });

});