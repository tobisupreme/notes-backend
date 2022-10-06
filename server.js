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
    .catch((error) => next(error))
})

// Create note
app.post('/api/notes', async (req, res, next) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note
    .save()
    .then((savedNote) => res.json(savedNote))
    .catch((error) => next(error))
})

/*
 * Update note
 */
app.put('/api/notes/:id', async (req, res, next) => {
  const id = req.params.id
  const body = req.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((err) => {
      next(err)
    })
})

/*
 * Delete note by id
 */
app.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: 'unknown endpoint' })
  next()
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.error(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
