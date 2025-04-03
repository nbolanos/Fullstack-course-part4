const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 3
  },
  name: String,
  passwordHash: {
    required: true,
    type: String,
    minLength:3
  },
})

userSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

const User = mongoose.model('User', userSchema) 
module.exports = User