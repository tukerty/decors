const express = require('express')
const app = express()
const port = 31415

app.use('/', express.static('static'))

app.listen(port, () => {
  console.log(`Personal landing listening on port ${port}`)
})