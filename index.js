const express = require('express')
const morgan = require('morgan')
const app = express()

// without this json-parser, the body property of post request would be undefined
app.use(express.json())
// https://github.com/expressjs/morgan
app.use(morgan('tiny'))

let phonebook = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

const generateId = () => Math.floor(Math.random() * 10000)

app.get('/', (request, response) => {
  response.send('<h1>Phonebook</h1>')
})

app.get('/info', (request, response) => {
  const date = new Date()
  const content = '<p>Phonebook has info for ' + phonebook.length + ' people.</br>' + date + '</p>'

  response.send(content)
})

app.get('/api/persons', (request, response) => {
  response.json(phonebook)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = phonebook.find((person) => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
 
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'missing name or number' 
    })
  }

  if (body.name && phonebook.find((person) => person.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  phonebook = phonebook.concat(person)
  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  phonebook = phonebook.filter((person) => person.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
