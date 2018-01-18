const mongoose = require('mongoose')

// Message Schema

Schema = mongoose.Schema
const messageSchema = new Schema({
  name:      { type: String, default: '' },
  createdOn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)
