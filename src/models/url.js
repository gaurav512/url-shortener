const mongoose = require('mongoose')
const validator = require('validator')

const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error('URL is invalid')
            }
        }
    },
    shortenedURL: {
        type: String,
        required: true,
        trim: true
    }
})

const Url = mongoose.model('Url', urlSchema)

module.exports = Url