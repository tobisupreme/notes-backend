const express = require('express')
const app = express()

const PORT = 8000
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on ${PORT}`)
})
