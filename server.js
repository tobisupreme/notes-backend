const express = require('express')
const app = express()

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

const PORT = 8000
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on ${PORT}`)
})
