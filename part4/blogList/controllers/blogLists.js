const blogListsRouter = require('express').Router()
const blogList = require('../models/blogList')

blogListsRouter.get('/', (request, response) => {
  blogList.find({}).then(blogLists => {
    response.json(blogLists)
  })
})

blogListsRouter.get('/:id', (request, response, next) => {
  blogList.findById(request.params.id)
    .then(blogList => {
      if (blogList) {
        response.json(blogList)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogListsRouter.post('/', (request, response, next) => {
  const body = request.body

  const blogList = new blogList({
    content: body.content,
    important: body.important || false,
  })

  blogList.save()
    .then(savedblogList => {
      response.json(savedblogList)
    })
    .catch(error => next(error))
})

blogListsRouter.delete('/:id', (request, response, next) => {
  blogList.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogListsRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  blogList.findById(request.params.id)
    .then(blogList => {
      if (!blogList) {
        return response.status(404).end()
      }

      blogList.content = content
      blogList.important = important

      return blogList.save().then((updatedblogList) => {
        response.json(updatedblogList)
      })
    })
    .catch(error => next(error))
})

module.exports = blogListsRouter