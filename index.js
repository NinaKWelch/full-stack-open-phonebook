// ensures that the environment variables are available globally
require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

// https://github.com/expressjs/cors
app.use(cors())
app.use(express.static('build'))

// without this json-parser, the body property of post request would be undefined
app.use(express.json())

// Removed in case of fly.io 
// https://github.com/expressjs/morgan
// morgan.token('body', function (request) {
//   return JSON.stringify(request.body)
// })

// app.use(morgan(
//   ':method :url :status :res[content-length] - :response-time ms :body'
// ))

// ENDPOINTS
app.get('/info', (request, response) => {
  const date = new Date()
  const content = '<p>Phonebook has info for ' + phonebook.length + ' people.</br>' + date + '</p>'

  response.send(content)
})

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons.map((person) =>
        person.toJSON() //returns a new array with every item mapped to a new object
      ))
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      person ? response.json(person) : response.status(404).end()
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body
 
  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'missing name or number' 
  //   })
  // }

  // if (body.name && phonebook.find((person) => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name must be unique' 
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save()
    .then((savedPerson) => savedPerson.toJSON()) // data is formatted
    .then((savedAndFormattedPerson) => {
      response.json(savedAndFormattedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

// ERROR HANDLING
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
