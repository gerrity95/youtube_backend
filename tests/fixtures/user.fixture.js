const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../../src/models/user');

let uuid = crypto.randomUUID();
let token = `test.${uuid}`;
let hashedToken = crypto.pbkdf2Sync(token, 'randomsigner',  
  1000, 64, `sha512`).toString(`hex`); 
const userOne = {
  _id: new mongoose.Types.ObjectId(),
  apiKey: hashedToken,
  prefix: 'test',
  scope: ['search', 'report'],
};

uuid = crypto.randomUUID();
token = `test.${uuid}`;
hashedToken = crypto.pbkdf2Sync(token, 'randomsigner',  
  1000, 64, `sha512`).toString(`hex`); 
const userTwo = {
  _id: new mongoose.Types.ObjectId(),
  apiKey: hashedToken,
  prefix: 'test',
  scope: ['search', 'report'],
};

const insertUsers = async (users) => {
  await User.insertMany(users);
};

module.exports = {
  userOne,
  userTwo,
  insertUsers,
};