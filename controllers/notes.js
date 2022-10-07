const notesRouter = require('express').Router()
const Note = require('../models/note')

/**
 * Get notes
 */
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

/**
 * Get notes by ID
 */
notesRouter.get('/:id', async (req, res) => {
  const note = await Note.findById(req.params.id)
  if (!note) return res.status(404).end()
  return res.status(200).json(note)
})

/**
 * Create notes
 */
notesRouter.post('/', async (req, res) => {
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
})

/*
 * Update note by ID
 */
notesRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const body = req.body

  const note = {
    content: body.content,
    important: body.important,
  }

  const updatedNote = await Note.findByIdAndUpdate(id, note, { new: true, runValidators: true, context: 'query' })
  res.json(updatedNote)
})

/*
 * Delete note by id
 */
notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

module.exports = notesRouter
