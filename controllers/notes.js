const notesRouter = require('express').Router()
const Note = require('../models/note')

/**
 * Get notes
 */
notesRouter.get('/', (req, res) => {
  Note.find({}).then((notes) => res.json(notes))
})

/**
 * Get notes by ID
 */
notesRouter.get('/:id', (req, res, next) => {
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

/**
 * Create notes
 */
notesRouter.post('/', async (req, res, next) => {
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
 * Update note by ID
 */
notesRouter.put('/:id', async (req, res, next) => {
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
notesRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Note.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

module.exports = notesRouter
