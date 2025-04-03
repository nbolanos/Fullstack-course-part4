const jwt = require('jsonwebtoken')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if(authorization && authorization.startsWith('Bearer ')) {
    token = authorization.replace('Bearer ', '')

    request.token = token
  }
  next()
}

const userExtractor = (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  request.user = decodedToken.username
  
  next()
}

module.exports = {
  tokenExtractor, userExtractor
}