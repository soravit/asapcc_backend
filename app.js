const express = require('express') // ใช้ framework express.js
const bodyParser = require('body-parser')

const app = express();
const cars = require('./route/cars')

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(bodyParser.raw());


app.use('/api',cars)

app.listen(5000,()=> {
    console.log('running at 5000')
})
