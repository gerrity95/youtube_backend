const request = require('supertest');
const httpStatus = require('http-status');
const crypto = require('crypto');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDb');
const { User } = require('../../src/models');
const { userOne, userTwo, insertUsers } = require('../fixtures/user.fixture');

setupTestDB();

describe('User routes', () => {
  describe('POST /user/generate_api', () => {

    test('should return 201 and successfully create new user if data is ok', async () => {
      const scope = {scope: ["search", "report"]};
      const res = await request(app)
        .post('/user/generate_api')
        .send(scope)
        .expect(httpStatus.OK);

      expect(res.body).toEqual({ 
        success: true, 
        apiKey: expect.anything(), 
        prefix: 'test' }
      );

      const dbUser = await User.findOne({});
      expect(dbUser).toBeDefined();
      expect(dbUser).toMatchObject({ apiKey: expect.anything(), prefix: 'test', scope: ['search', 'report'] });
    });

    test('should return 401 error if scope is not defined', async () => {
      await request(app).post('/user/generate_api').expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if scope is malformed', async () => {
      const scope = {scope: 'wrong format'};
      await request(app).post('/user/generate_api').send(scope).expect(httpStatus.BAD_REQUEST);
    });
  });

  // describe('DELETE /v1/users/:userId', () => {
  //   test('should return 204 if data is ok', async () => {
  //     await insertUsers([userOne]);

  //     await request(app)
  //       .delete(`/v1/users/${userOne._id}`)
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .send()
  //       .expect(httpStatus.NO_CONTENT);

  //     const dbUser = await User.findById(userOne._id);
  //     expect(dbUser).toBeNull();
  //   });

  //   test('should return 401 error if access token is missing', async () => {
  //     await insertUsers([userOne]);

  //     await request(app).delete(`/v1/users/${userOne._id}`).send().expect(httpStatus.UNAUTHORIZED);
  //   });

  //   test('should return 403 error if user is trying to delete another user', async () => {
  //     await insertUsers([userOne, userTwo]);

  //     await request(app)
  //       .delete(`/v1/users/${userTwo._id}`)
  //       .set('Authorization', `Bearer ${userOneAccessToken}`)
  //       .send()
  //       .expect(httpStatus.FORBIDDEN);
  //   });

  //   test('should return 204 if admin is trying to delete another user', async () => {
  //     await insertUsers([userOne, admin]);

  //     await request(app)
  //       .delete(`/v1/users/${userOne._id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send()
  //       .expect(httpStatus.NO_CONTENT);
  //   });

  //   test('should return 400 error if userId is not a valid mongo id', async () => {
  //     await insertUsers([admin]);

  //     await request(app)
  //       .delete('/v1/users/invalidId')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send()
  //       .expect(httpStatus.BAD_REQUEST);
  //   });

  //   test('should return 404 error if user already is not found', async () => {
  //     await insertUsers([admin]);

  //     await request(app)
  //       .delete(`/v1/users/${userOne._id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send()
  //       .expect(httpStatus.NOT_FOUND);
  //   });
  // });

});