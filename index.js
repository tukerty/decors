const express = require('express')
const corsProxy = require('@isomorphic-git/cors-proxy/middleware.js')

const app = express()
const port = 31413
const options = {}

app.use(corsProxy(options))

app.listen(port, () => {
  console.log(`Decors listening on port ${port}`)
})