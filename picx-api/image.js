'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { promisify } = require('util')
const { Router } = require('express')
const { NotFound, BadRequest } = require('@picx/errors')
const { getLogger, cache } = require('@picx/utils')
const { Image } = require('@picx/db')
const { isAuthenticated } = require('./auth')

const dest = path.join(os.tmpdir(), 'uploads')
const upload = multer({ dest })

const log = getLogger(__dirname, __filename)
const readFile = promisify(fs.readFile)
const router = new Router()

// Get an image
router.get('/:imageId', async function getImage (req, res, next) {
  try {
    const { id, params } = req
    const { imageId } = params

    if (!cache.has(imageId)) {
      log.info({ id, message: `fetching image:${imageId} from db` })
      const image = await Image.findById(imageId)
      if (!image) {
        next(new NotFound(`Can't find image with id ${imageId}`))
        return
      }

      cache.set(imageId, image)
    }

    const { contentType, data } = cache.get(imageId)

    res.set('Content-Type', contentType)
    res.send(data)
  } catch (err) {
    next(err)
  }
})

// Upload an image
router.post('/upload', isAuthenticated, upload.single('img'), async function uploadImage (req, res, next) {
  try {
    const { id, file } = req

    log.debug({ id, message: dest })
    log.info({ id, message: file })

    if (!file) {
      next(new BadRequest('please provide an img'))
      return
    }

    const image = new Image({
      contentType: file.mimetype,
      data: await readFile(file.path)
    })

    const saved = await image.save()
    const imageId = saved._id.toString()

    cache.set(imageId, saved)
    res.send({ _id: imageId })
  } catch (err) {
    next(err)
  }
})

// Delete an image
router.delete('/:imageId', isAuthenticated, TODO)

function TODO (req, res) {
  log.warn(`TODO implement: ${req.method} ${req.url}`)
  res.status(501).send('TODO')
}

module.exports = router
