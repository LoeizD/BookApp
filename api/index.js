const express = require('express')
const app = express()
var cors = require('cors')

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

app.listen(6600, function () {
    console.log('CORS-enabled web server listening on port 80')
})
