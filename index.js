// Require dependencies 
const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on')
require('dotenv').config()

// Create instance of express app
let app = express()

// Set view engine
app.set('view engine', 'hbs')

// Static folder 
app.use(express.static('public'))

// Set up wax-on
wax.on(hbs.handlebars)
wax.setLayoutPath('./views/layouts')

// Enable forms
app.use(express.urlencoded({
    extended: false
}))

// Import in routes
const landingRoutes = require('./routes/landing')
const productsRoutes = require('./routes/products')

// Use routes
app.use('/', landingRoutes)
app.use('/products', productsRoutes)

app.listen(3000, function(){
    console.log('Server started')
})