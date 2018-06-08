'use strict'

const { Router } = require('express')
const { BadRequest } = require('@picx/errors')
const { getLogger, cache } = require('@picx/utils')
const { Media } = require('@picx/db')
const { isAuthenticated } = require('./auth')

const log = getLogger(__dirname, __filename)
const router = new Router()

// Get a list of media objects
router.get('/', async function getAllMedia (req, res, next) {
  try {
    const { id } = req
    if (!cache.has('media')) {
      log.info({ id, message: 'fetching media from db' })
      const media = await Media.find()
      cache.set('media', media)
    }
    res.send(cache.get('media'))
  } catch (err) {
    next(err)
  }
})

// Get a media object by id
router.get('/:id', TODO)

// Save a media object
router.post('/', isAuthenticated, async function postMedia (req, res, next) {
  try {
    const { id, body } = req
    const { description, image } = body

    log.info({ id, message: body })

    if (!description) {
      next(new BadRequest('description is required'))
      return
    }

    if (!image) {
      next(new BadRequest('image is required'))
      return
    }

    const media = new Media({ description, image })
    res.send(await media.save())
    cache.del('media')
  } catch (err) {
    next(err)
  }
})

// Update a media object
router.put('/:id', isAuthenticated, TODO)

// Delete a media object
router.delete('/:id', isAuthenticated, TODO)

function TODO (req, res) {
  log.warn(`TODO implement: ${req.method} ${req.url}`)
  res.status(501).send('TODO')
}

module.exports = router
