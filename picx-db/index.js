'use strict'

const mongoose = require('mongoose')
const config = require('@picx/config')
const { getLogger, terminate } = require('@picx/utils')

const Image = require('./models/image')
const Media = require('./models/media')

const log = getLogger(__dirname, __filename)

if (!config.db) {
  log.error('please set MONGODB_URL env variable')
  process.exit(1)
}

mongoose.connect(config.db)
mongoose.connection.on('error', terminate(1, 'dbError'))
mongoose.connection.once('open', () => {
  log.info('db connected')
})

module.exports = {
  Image,
  Media
}
