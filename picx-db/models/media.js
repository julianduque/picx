'use strict'

const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
  description: {
    type: String
  },
  image: {
    type: Schema.Types.ObjectId,
    ref: 'images',
    required: true
  }
})

if (!schema.options.toObject) {
  schema.options.toObject = {}
}

schema.options.toObject.transform = (doc, ret, options) => {
  // delete version
  delete ret.__v
  return ret
}

module.exports = mongoose.model('media', schema)
