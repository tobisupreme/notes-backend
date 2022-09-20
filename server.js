require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const Note = require('./models/note')

// allow requests from all origins
app.use(cors())

// implement request logger middleware
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('-----')
  next()
}

// use middleware to parse req.body as JSON (before it gets to the routes)
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)

// Hard coded list of notes
let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-06-09T19:08:321Z',
    important: true,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2022-06-09T19:09:321Z',
    important: false,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-06-09T19:10:321Z',
    important: true,
  },
]

// Home route
app.get('/', (req, res) => {
  res.send('<h1>Hey!</h1>')
})

// Notes route
app.get('/api/notes', (req, res) => {
  Note.find({}).then((notes) => res.json(notes))
})

// Get note by id
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.json(note)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Generate note Id
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max.apply(null, notes.map((n) => n.id)) : 0
  return maxId + 1
}

// Create note
app.post('/api/notes', (req, res) => {
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save().then(savedNote => res.json(savedNote))
})

// Update note
app.put('/api/notes/:id', (req, res) => {
  const id = req.params.id
  let note = notes.find((note) => note.id === id)
  const body = req.body
  
  if (!body.content) {
    return res.status(400).json({
      error: 'content missing'
    })
  }

  note = {...note, important:!note.important}

  notes = notes.map(n => {
    return n.id !== id ? n : note 
  })
  
  res.json(note)
})

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({error: 'unknown endpoint'})
  next()
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, net) => {
  console.error(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  net(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
