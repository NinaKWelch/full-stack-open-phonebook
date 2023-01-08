// ensures that the environment variables are available globally
require('dotenv').config()
const express = require('express')
// const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

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

// https://github.com/expressjs/cors
app.use(cors())

app.use(express.static('build'))

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

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person)
  })
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
  const id = Number(request.params.id)
  phonebook = phonebook.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
