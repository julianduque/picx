'use strict'

const { getLogger } = require('@picx/utils')

const log = getLogger(__dirname, __filename)

function isAuthenticated (req, res, next) {
  log.warn('TODO: Implement authentication')
  next()
}

module.exports = {
  isAuthenticated
}
