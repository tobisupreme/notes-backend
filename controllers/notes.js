const notesRouter = require('express').Router()
const Note = require('../models/note')

/**
 * Get notes
 */
notesRouter.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({})
    res.json(notes)
  } catch (err) {
    next(err)
  }
})

/**
 * Get notes by ID
 */
notesRouter.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
    if (!note) return res.status(404).end()
    return res.status(200).json(note)
  } catch (error) {
    next(error)
  }
})

/**
 * Create notes
 */
notesRouter.post('/', async (req, res, next) => {
  try {
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

    const savedNote = await note.save()
    return res.status(201).json(savedNote)
  } catch (err) {
    next(err)
  }
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

  try {
    const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
    res.json(updatedNote)
  } catch (err) {
    next(err)
  }
})

/*
 * Delete note by id
 */
notesRouter.delete('/:id', async (req, res, next) => {
  try {
    await Note.findByIdAndRemove(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = notesRouter
