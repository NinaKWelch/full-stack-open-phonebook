const mongoose = require('mongoose')
// Do not display DeprecationWarning
mongoose.set('strictQuery', true)

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.ec4c8lr.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then()
  .catch((err) => console.log(err))

if (process.argv.length === 3) {  
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4] || 'missing number'
  })

  person
    .save()
    .then((result) => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
  })
}
