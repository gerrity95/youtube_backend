const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require('crypto'); 
const config = require('../config/config');  

const User = new Schema({
  apiKey: {
    type: String,
    unique: true,
    required: true
  },
  prefix: {
    type: String,
    default: "",
  },
  scope: {
    type: Array,
  },
})

// Method to set salt and hash the apiKey for a user 
User.methods.hashApiKey = function(rawKey) { 
  // Hashing user's salt and password with 1000 iterations, 
  this.apiKey = crypto.pbkdf2Sync(rawKey, config.keySigner,  
  1000, 64, `sha512`).toString(`hex`); 
}; 


module.exports = mongoose.model("User", User)
