const path = require('path')
const express = require('express')
const cryptoRandomString = require('crypto-random-string')
const Url = require('./models/url')
require('dotenv').config()
require('./db/mongoose')

const port = process.env.PORT

const app = express()
const publicDirPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirPath))

app.get('/:url', async (req, res) => {
    const url = req.params.url
    try {
        const found = await Url.findOne({ shortenedURL: url })
        if(!found) {
            return res.status(404).send({
                error: 'Given url does not exist'
            })
        }    
        res.status(301).redirect(found.url)
    }
    catch(e) {
        res.status(500).send()
    }
})

app.post('', async (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    const _url = req.body.url
    const found = await Url.findOne({ _url })
    
    if(found) {
        return res.send({ shortenedURL : process.env.WEB_URL + found.shortenedURL })
    }

    let short_url_string;
    while(true)
    {
        short_url_string = cryptoRandomString({ length: 6, type: 'alphanumeric' })
        const alreadyExist = await Url.findOne({ short_url_string: short_url_string })
        if(!alreadyExist)
            break
    }

    const url = new Url({
        url: _url,
        shortenedURL: short_url_string
    })

    try {
        await url.save()
        res.status(201).send({ shortenedURL: process.env.WEB_URL + short_url_string })
    }
    catch(e) {
        res.status(400).send({ error: 'Server error' })
    }
})

app.listen(port, () => {
    console.log('Server is set up on port ' + port)
})