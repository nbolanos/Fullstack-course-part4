const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const correctPass = user === null 
    ? false 
    : await bcrypt.compare(password, user.passwordHash)
  
  if(!(user && correctPass)) {
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const tokenForUser = {
    username: user.username,
    id: user._id
  }

  const token = jwt.sign(tokenForUser, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter