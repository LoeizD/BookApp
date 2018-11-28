const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');


app.use(cors())

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})  

app.listen(6600, function () {
    console.log('CORS-enabled web server listening on port 80')
})


// a tool to parse a book in a mongo db, run once

// a server to
    // give unlocked words to any request
    // recieve a payment
    // unlock a new word

// a web page that diplays the words + interface to buy