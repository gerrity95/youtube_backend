const { User } = require('../../../src/models');
const crypto = require('crypto');

describe('User model', () => {
  describe('User validation', () => {
    let newUser;
    let uuid = crypto.randomUUID();
    let token = `test.${uuid}`;
    let hashedToken = crypto.pbkdf2Sync(token, 'randomsigner', 1000, 64, `sha512`).toString(`hex`); 
    beforeEach(() => {
      newUser = {
        apiKey: hashedToken,
        prefix: 'test',
        scope: ['search', 'report'],
      };
    });

    test('should correctly validate a valid user', async () => {
      await expect(new User(newUser).validate()).resolves.toBeUndefined();
    });
  });
});