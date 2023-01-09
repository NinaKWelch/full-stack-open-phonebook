const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// Do not display DeprecationWarning
mongoose.set('strictQuery', true)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then((result) => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'name too short'],
    unique: true,
    required: [true, 'name is required'],
    uniqueCaseInsensitive: true
  },
  number: {
    type: String,
    minLength: [8, 'number too short'],
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'number is required']
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

personSchema.plugin(uniqueValidator, { message: 'name must be unique' })

module.exports = mongoose.model('Person', personSchema)
