'use strict'

const bole = require('bole')
const path = require('path')
const uuid = require('uuid')
const chalk = require('chalk')
const morgan = require('morgan')
const through = require('through2')
const streamFile = require('stream-file-archive')
const { pkg } = require('@picx/config')

const log = getLogger(__dirname, __filename)
const customMorgan = morgan(middleware)

const levels = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.magenta
}

const rotator = streamFile({
  path: `logs/${pkg.name}-${pkg.version}-%Y-%m-%d.log`,
  symlink: 'logs/current.log',
  compress: true
})

const formatter = through((chunk, _, callback) => {
  try {
    let { id, level, name, message } = JSON.parse(chunk)
    const color = levels[level]
    id = id ? ` ${chalk.blue(id)} ` : ' '
    message = typeof message === 'object' ? JSON.stringify(message, null, 2) : message
    console.log(`${color(level)}${id}(${chalk.cyan(name)}) ${message}`)
    callback(null, chunk)
  } catch (err) {
    callback(err)
  }
})

bole.output({
  level: process.env.DEBUG ? 'debug' : 'info',
  stream: process.env.NODE_ENV === 'production' ? rotator : formatter
})

function getLogger (...names) {
  const name = names.map(name => path.basename(name, '.js')).join(path.sep)
  return bole(name)
}

const logHandler = (req, res, next) => {
  req.id = uuid.v4()
  customMorgan(req, res, next)
}

function middleware (tokens, req, res) {
  const id = req.id
  const { method, url, status } = tokens
  const message = `${method(req, res)} ${url(req, res)} ${status(req, res)} - ${tokens['response-time'](req, res)} ms`
  log.info({ id, message })
  return null
}

module.exports = {
  getLogger,
  logHandler
}
