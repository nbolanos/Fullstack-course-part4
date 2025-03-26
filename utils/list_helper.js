//Did not use lodash due to abundant amount of function/methods
//will have to come back to this one.
//const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if(blogs.length === 0) return 0

  let total = 0;

  blogs.map(blog => {
    total += blog.likes
  })

  return total;
}

const favoriteBlog = (blogs) => {
  let mostLikes = 0;

  if(blogs.length === 0) return mostLikes

  blogs.find(blog => {
    mostLikes = Math.max(blog.likes)
  })

  return blogs[mostLikes]
}

//Overly complicated way of obtaining author with most blogs
//and constructing a new object based on given results
//It works though...
const mostBlogs = (blogs) => {
  if(blogs.length === 0) return 0
  let newObj = {}

  const summary = blogs.reduce((acc, {author}) => ({
    ...acc, [author]: (acc[author] || 0) + 1
  }), {})
  
  Object.entries(summary).forEach((key, val) => {
    if(Math.max(val)) {
      newObj = {
        author: key[0],
        blogs: key[1]
      }
    }
  })

  return newObj
}

//Some use of maps to keep track of likes occurrences, as well
//as using the likes as the value for the key
//Did not troubleshoot far enough, but for some reason Math.max
//was not working; probably getting largest index of array,
//rather than the actual value
//Resorted to using good old comparison
const mostLikes = (blogs) => {
  let authorMap = new Map()
  let result = {}
  let max = 0

  blogs.map(blog => {
    authorMap[blog.author] = (authorMap[blog.author] + blog.likes || blog.likes)
  })

  Object.entries(authorMap).forEach((key, val) => {
    if(key[1] > max) {
      max = key[1]
      result = {
        author: key[0],
        likes: key[1]
      }
    }
  })

  return result
}

module.exports = {
  dummy, 
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}