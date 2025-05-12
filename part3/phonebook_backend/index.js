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
  
app.use(requestLogger)
app.use(express.json())
app.use(express.static('dist'))

morgan.token("body", (req) => {
    return req.method === "POST" ? JSON.stringify(req.body) : ""
  })
  
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

let persons= []

app.get("/api/persons", (request, response) =>{
    Person.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) =>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    
    if(person){
        response.json(person)
    } else {
        response.status(404).end()
    }
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

app.delete("/api/persons/:id", (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => Number(n.id)))
        : 0
    return String(maxId + 1)
}

app.post("/api/persons", (request, response) => {
    const {name, number} = request.body
    console.log("Request body:", request.body)
    if(!name || !number){
        return response.status(404).json({error: "name or number is missing"})
    }

    const nameExists = persons.some(person => person.name === name)
    if(nameExists){
        return response.status(404).json({error: "name must be unique"})
    }

    const person = new Person({
        id: generateId(),
        name,
        number,
    })

    person.save().then((savedPerson) =>{
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})