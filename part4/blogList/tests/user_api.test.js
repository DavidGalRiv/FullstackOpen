const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const newUser = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await newUser.save()
})

describe('User creation validation', () => {
  describe('when required fields are missing', () => {
    test('fails if username is missing', async () => {
      const newUser = {
        name: 'NoUsername',
        password: 'validpass'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(result.body.error.includes('Username is required'))
    })

    test('fails if password is missing', async () => {
      const newUser = {
        username: 'nouser',
        name: 'NoPass'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(result.body.error.includes('Password is required'))
    })
  })

  describe('when fields are too short', () => {
    test('fails if username is shorter than 3 chars', async () => {
      const newUser = {
        username: 'ab',
        name: 'ShortName',
        password: 'validpassword'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(result.body.error.includes('Username must be at least 3 characters long'))
    })

    test('fails if password is shorter than 3 chars', async () => {
      const newUser = {
        username: 'validusername',
        name: 'ShortPass',
        password: 'ab'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(result.body.error.includes('Password must be at least 3 characters long'))
    })
  })

  describe('when username already exists', () => {
    test('fails if username already exists', async () => {
      const newUser = {
        username: 'root',
        name: 'Duplicate',
        password: 'anotherpass'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)

      assert.ok(result.body.error.includes('Username must be unique'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
