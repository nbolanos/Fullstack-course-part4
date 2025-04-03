const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')

const api = supertest(app)

describe('Exercises 4.8-4.12', () => {
  test('fetching blogs', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  
  test('id format is correct', async () => {
    const blogs = await api.get('/api/blogs')
  
    const keys = Object.keys(blogs.body[0])
  
    let idFormat = null
    keys.map(p => {
      if(p.includes('id'))
        idFormat = p
    })
  
    assert.strictEqual('id', idFormat)
  })
  
  test('new blog created successfully', async () => {
    const blogsAtStart = await api.get('/api/blogs')

    const testBlog = {
      title: "Testing Life",
      author: "Mr. Tester",
      url: "the.test.url",
      likes: "101",
    }
  
    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await api.get('/api/blogs')
    
    assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length + 1)
  
    const title = blogs.body.map(m => m.title)
    assert(title.includes('Testing Life'))
  
  })
  
  test('checking default value of likes', async () => {
    const defaultLikesBlog = {
      title: "More tests",
      author: "Mr. Likes",
      url: "likesthis.url",
    }
  
    await api
      .post('/api/blogs')
      .send(defaultLikesBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogs = await api.get('/api/blogs')
    const likes = blogs.body.map(m => m.likes)
    assert.strictEqual(blogs.body.length, likes.length)
  })
  
  test('missing title and or url', async () => {
    const prevBlogs = await api.get('/api/blogs')
  
    const testBlog = {
      author: "Alejandro Bolaños",
    }
  
    await api
      .post('/api/blogs')
      .send(testBlog)
      .expect(400)
    
    const currBlogs = await api.get('/api/blogs')
    assert.strictEqual(prevBlogs.body.length, currBlogs.body.length)
  })
})

describe('Exercises 4.15-4.23', () => {
  test('valid users are created', async () => {
    const blogsAtStart = await api.get('/api/users')
  
    const blog = new Blog({
      username: 'Testing',
      name: 'Mr. Tester'
    })
  
    await api.post('/api/users')
      .send(blog)
      .expect(400)
    
    const blogsAtEnd = await api.get('/api/users')
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

after(async () => {
  mongoose.connection.close()
})