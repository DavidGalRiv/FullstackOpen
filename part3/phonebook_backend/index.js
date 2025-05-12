require('dotenv').config()

const express = require("express")
const morgan = require("morgan")
const Person = require('./models/phonebook')
const app = express()

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : ""
  })
  
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))


app.get("/api/persons", (request, response) =>{
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response, next) =>{
    Person.findById(request.params.id)
        .then(person => {
          if (person) {
            response.json(person)
          } else {
            response.status(404).end()
          }
        })
        .catch(error => next(error))
})


app.get("/info", (request, response) => {
    const count = persons.length
    const date  = new Date()
    response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${date}</p>
        `
    )
   
})

// const generateId = () => {
//     const maxId = persons.length > 0
//         ? Math.max(...persons.map(n => Number(n.id)))
//         : 0
//     return String(maxId + 1)
// }

// app.post("/api/persons", (request, response) => {
//     const {name, number} = request.body
//     console.log("Request body:", request.body)
//     if(!name || !number){
//         return response.status(404).json({error: "name or number is missing"})
//     }

//     const nameExists = persons.some(person => person.name === name)
//     if(nameExists){
//         return response.status(404).json({error: "name must be unique"})
//     }

//     const person = new Person({
//         id: generateId(),
//         name,
//         number,
//     })

//     person.save().then((savedPerson) =>{
//         response.json(savedPerson)
//     })
// })

app.delete("/api/persons/:id", (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  
app.use(unknownEndpoint)
app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})