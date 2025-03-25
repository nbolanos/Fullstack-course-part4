const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogRouter = require('./controllers/blogs')
const blog = require('./models/blog')

mongoose.set('strictQuery', false)

logger.info('Connecting to url:', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to Mongo DB')
  })
  .catch(error => {
    logger.info('Unable to connect to Mongo DB', error.message)
  })

app.use(cors())
//app.use(express.static('dist'))
app.use(express.json())
app.use('/api/blogs', blogRouter)

module.exports = app