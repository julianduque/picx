'use strict'

const cache = require('./cache')
const terminate = require('./terminate')
const { getLogger, logHandler } = require('./logger')

module.exports = {
  cache,
  terminate,
  getLogger,
  logHandler
}
