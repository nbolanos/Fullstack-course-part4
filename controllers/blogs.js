const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

blogRouter.get('/:id', (request, response) => {
  Blog.findById(request.params.id).then(blog => {
    if(blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  })
})

blogRouter.post('/', (request, response) => {
  const body = request.body

  if(!body) {
    return response.status(400).send({ error: 'content missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blog.save().then(savedBlog => {
    response.json(savedBlog)
  })
})

blogRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id).then(() => {
    console.log(response)
    response.status(204).end()
  })
})

module.exports = blogRouter