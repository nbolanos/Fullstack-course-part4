const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

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
app.use(middleware.tokenExtractor)
//app.use(express.static('dist'))
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app