const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }

    const users = await User.find({})
    if (users.length === 0) {
      return response.status(400).json({ error: 'No users in the database' })
    }

    const randomIndex = Math.floor(Math.random() * users.length)
    const user = users[randomIndex]

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

    response.status(201).json(populatedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})

module.exports = blogsRouter
