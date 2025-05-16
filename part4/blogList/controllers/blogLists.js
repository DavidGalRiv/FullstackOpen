const blogListsRouter = require('express').Router()
const BlogList = require('../models/blogList')

blogListsRouter.get('/', (request, response) => {
  BlogList.find({}).then(blogLists => {
    response.json(blogLists)
  })
})

blogListsRouter.get('/:id', (request, response, next) => {
  BlogList.findById(request.params.id)
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

  const blogList = new BlogList({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  blogList.save()
    .then(savedblogList => {
      response.json(savedblogList)
    })
    .catch(error => next(error))
})

blogListsRouter.delete('/:id', (request, response, next) => {
  BlogList.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

blogListsRouter.put('/:id', (request, response, next) => {
  const { title, author, url, likes } = request.body

  BlogList.findById(request.params.id)
    .then(blogList => {
      if (!blogList) {
        return response.status(404).end()
      }

      blogList.title = title
      blogList.author = author
      blogList.url = url
      blogList.likes = likes

      return blogList.save().then((updatedblogList) => {
        response.json(updatedblogList)
      })
    })
    .catch(error => next(error))
})

module.exports = blogListsRouter