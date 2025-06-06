const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogListRouter = require('./controllers/blogLists')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/blogs', blogListRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
