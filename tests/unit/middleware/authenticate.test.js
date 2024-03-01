const { verifyToken } = require('../../../src/middleware/authenticate');
const Api401Error = require('../../../src/utils/ApiError')

describe('Middleware', () => {
  describe('Authentication Middleware', () => {
    test('Ensure the authentication middleware validates the token properly', () => {
      const token = 'test.2d3b6d05-9a40-49b4-b977-00c083cd6e76';
      const req = jest.fn(), res = { sendStatus: jest.fn(), locals: {token: ''} }, next = jest.fn();
      req.headers = {
        authorization: `Bearer ${token}`
      }
      verifyToken(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    test('Throw error assuming the authorization header is incorrect', () => {
      const req = jest.fn(), res = { sendStatus: jest.fn(), locals: {token: ''} }, next = jest.fn();
      req.headers = {
        authorization: `Bad header`
      }
      expect(() => { verifyToken(req, res, next); }).toThrow(Api401Error);
    });

    test('Throw error assuming there is no key passed in as a header', () => {
      const req = jest.fn(), res = { sendStatus: jest.fn(), locals: {token: ''} }, next = jest.fn();
      expect(() => { verifyToken(req, res, next); }).toThrow(Api401Error);
    });
  });
});