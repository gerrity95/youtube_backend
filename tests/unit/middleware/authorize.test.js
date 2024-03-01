const { userOne, userTwo, insertUsers } = require('../../fixtures/user.fixture');
const { verifyUser } = require('../../../src/middleware/authorize');
const setupTestDB = require('../../utils/setupTestDb');
const crypto = require('crypto');
const Api401Error = require('../../../src/utils/ApiError')
const { User } = require('../../../src/models');

setupTestDB();

describe('Middleware', () => {
  describe('Authorization Middleware', () => {
    beforeEach(() => {
      req = jest.fn();
      res = jest.fn();
      next = jest.fn()
    });
    afterEach(() => {
      req.mockReset();
      res.mockReset();
      next.mockReset();
    })

    test('Ensure the authorize middleware verifies the token successfully', async () => {
      let token = `test.${crypto.randomUUID()}`;
      let hashedToken = crypto.pbkdf2Sync(token, 'randomsigner',  
        1000, 64, `sha512`).toString(`hex`); 
      const user = new User({
        apiKey: hashedToken,
        prefix: 'test',
        scope: ['search', 'report'],
      });
      await user.save(userOne)
      res.locals = {token: token}      
      const verifyFunc = verifyUser(['search']);
      await verifyFunc(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test("Test the authorize middleware if the token doesn't exist", async () => {
      let token1 = `test.${crypto.randomUUID()}`;
      let token2 = `test.${crypto.randomUUID()}`;      
      let hashedToken = crypto.pbkdf2Sync(token1, 'randomsigner',  
        1000, 64, `sha512`).toString(`hex`); 
      const user = new User({
        apiKey: hashedToken,
        prefix: 'test',
        scope: ['search', 'report'],
      });
      await user.save(userOne)
      res.locals = {token: token2}      
      const verifyFunc = verifyUser(['search']); 
      try {
        await verifyFunc(req, res, next);
      } catch (error) {
        expect(error).toMatch(Api401Error);
      }
    });

    test("Test the authorize middleware if the user doesn't have the correct scope", async () => {
      let token1 = `test.${crypto.randomUUID()}`;
      let hashedToken = crypto.pbkdf2Sync(token1, 'randomsigner',  
        1000, 64, `sha512`).toString(`hex`); 
      const user = new User({
        apiKey: hashedToken,
        prefix: 'test',
        scope: ['report'],
      });
      await user.save(userOne)
      res.locals = {token: token1}      
      const verifyFunc = verifyUser(['search']); 
      try {
        await verifyFunc(req, res, next);
      } catch (error) {
        expect(error).toMatch(Api401Error);
      }
    });
  });
});