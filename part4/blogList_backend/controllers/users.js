const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
  response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  const { username, name, password } = request.body

  if (!username) {
    return response.status(400).json({
      error: 'Username is required'
    })
  }

  if (username.length < 3) {
    return response.status(400).json({
      error: 'Username must be at least 3 characters long'
    })
  }

  if (!password) {
    return response.status(400).json({
      error: 'Password is required'
    })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'Password must be at least 3 characters long'
    })
  }

  try {
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({
        error: 'Username must be unique'
      })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)

  } catch (error) {
    next(error)
  }
})


module.exports = usersRouter
