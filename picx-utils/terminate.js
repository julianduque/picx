'use strict'

const { getLogger } = require('./logger')
const log = getLogger(__dirname, __filename)

function terminate (code, reason) {
  return (error, p) => {
    let params = { code, reason }

    if (error) {
      params.error = error
      params.message = error.message
      params.stack = error.stack
    }

    if (p) {
      params.promise = p
    }

    log.info({ message: params })

    if (code === 0) {
      process.exit(code)
    }

    setTimeout(_ => { process.exit(code) }, 500).unref()
  }
}

module.exports = terminate
