'use strict'

const LRU = require('lru-cache')

const cache = new LRU({
  max: 100,
  maxAge: 1000 * 60 * 60 // 1 hour
})

module.exports = cache
