const mongoose = require('mongoose')

// Message Schema

Schema = mongoose.Schema
const messageSchema = new Schema({
  name:      { type: String, default: '' },
  // Always store coordinates in longitude latitude order
  coords:    { type: [Number], index: '2dsphere' },
  createdOn: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Message', messageSchema)
