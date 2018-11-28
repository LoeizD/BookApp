const express = require('express')
const app = express()
const cors = require('cors')
// const dotenv = require('dotenv');
require('dotenv').config()

app.use(cors())

app.get('/products/:id', function (req, res, next) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
})  

/*
// First route
app.get('/', (req, res) => {
    res.json({ message: 'Hello bworld' })
})
*/

// Starting server
// app.listen('6600')


console.log(process.env);
console.log(process.env.MLAB_URI);


app.listen(6600, function () {
    console.log('CORS-enabled web server listening on port 80')
})
