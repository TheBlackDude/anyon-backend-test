const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

// Define the user schema
const Schema = mongoose.Schema
const userSchema = new Schema({
  local: {
    email: String,
    password: String
  }
})

// Method for generating a hash for each user
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// Method for validating passwords
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.local.password)
}

// Create the User model and export it
module.exports = mongoose.model('User', userSchema)
