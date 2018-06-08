'use strict'

class NotFound extends Error {
  constructor (...args) {
    super(...args)
    this.name = this.constructor.name
    this.code = 404
    Error.captureStackTrace(this, NotFound)
  }
}

module.exports = NotFound
