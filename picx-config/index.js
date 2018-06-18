'use strict'

const pkg = require('../package.json')

const config = {
  db: process.env.MONGODB_URL
}

Object.assign(config, { pkg })

module.exports = config
