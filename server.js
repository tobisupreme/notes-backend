const express = require('express')
const app = express()

// use middleware to parse req.body as JSON (before it gets to the routes)
app.use(express.json())

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
  res.json(notes)
})

// Get note by id
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find((note) => note.id == id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
  
})

// Delete note
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter((note) => note.id !== id)
  res.status(204).end()
})

const PORT = 8000
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on ${PORT}`)
})
