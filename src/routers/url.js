const express = require('express')
const router = new express.Router()
const Url = require('../models/url')
const cryptoRandomString = require('crypto-random-string')


// GET
router.get('/:url', async (req, res) => {
    
    const url = req.params.url
    try {
        const found = await Url.findOne({ shortenedURL: url })
        
        if(!found) {
            return res.status(404).send({
                error: 'Given short url does not exist in our database'
            })
        }

        res.status(301).redirect(found.url)
    }
    catch(e) {
        res.status(500).send()
    }
})


// POST
router.post('', async (req, res) => {
    
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    })
    
    const _url = encodeURI(req.body.data)
    const found = await Url.findOne({ url: _url })
    
    // If the given url already has a shortened version in our database
    if(found) {
        return res.send({ shortenedURL : process.env.WEB_URL + found.shortenedURL })
    }

    // Generating a short string till we find a unique one
    let short_url_string;
    while(true)
    {
        short_url_string = cryptoRandomString({ length: 6, type: 'alphanumeric' })
        const alreadyExist = await Url.findOne({ shortenedURL: short_url_string })
        if(!alreadyExist)
            break
    }

    // Creating a new document
    const url = new Url({
        url: _url,
        shortenedURL: short_url_string
    })

    try {
        await url.save()
        res.status(201).send({ shortenedURL: process.env.WEB_URL + short_url_string })
    }
    catch(e) {
        res.status(400).send({ error: 'Server error, please re-check the provided URL' })
    }
})


module.exports = router