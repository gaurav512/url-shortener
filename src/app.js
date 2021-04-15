const path = require('path')
const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const urlRouter = require('./routers/url')

const port = process.env.PORT

const app = express()
const publicDirPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirPath))
app.use(urlRouter)

app.listen(port, () => {
    console.log('Server is set up on port ' + port)
})