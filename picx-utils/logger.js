'use strict'

const bole = require('bole')
const path = require('path')
const uuid = require('uuid')
const chalk = require('chalk')
const morgan = require('morgan')
const through = require('through2')

const log = getLogger(__dirname, __filename)
const customMorgan = morgan(middleware)

const levels = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.magenta
}

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
  stream: formatter
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
