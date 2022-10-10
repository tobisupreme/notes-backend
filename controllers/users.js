const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
  const { username, password, name } = req.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({
      error: 'username must be unique'
    })
  }

  if (username.length < 5) {
    return res.status(400).json({
      error: 'username must contain at least 5 characters'
    })
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'password must contain at least 6 characters'
    })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

module.exports = usersRouter
