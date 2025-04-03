const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const result = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(result)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if(blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const username = request.user

  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if(!decodedToken.id)
      return response.status(401).json({ error: 'invalid token' })

  const user = await User.findById(decodedToken.id)

  if(!body) {
    return response.status(400).send({ error: 'content missing' })
  }

  const blog = new Blog({
    url: body.url,
    title: body.title,
    author: body.author,
    user: user.id,
    likes: body.likes
  })

  if(!blog.title || !blog.url) {
    return response.status(400).end()
  }
  
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body
  
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  await blog.save()
  response.status(201).send(blog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  const user = await User.findById(decodedToken.id)
  const idToDelete = user.blogs[user.blogs.length - 1].toString()

  if(!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' })
  }

  await Blog.findByIdAndDelete(idToDelete)
})

module.exports = blogsRouter