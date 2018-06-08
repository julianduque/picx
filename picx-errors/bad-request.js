'use strict'

class BadRequest extends Error {
  constructor (...args) {
    super(...args)
    this.name = this.constructor.name
    this.code = 400
    Error.captureStackTrace(this, BadRequest)
  }
}

module.exports = BadRequest
