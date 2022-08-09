// Require dependencies 
const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on')
require('handlebars-helpers')({
    handlebars: hbs.handlebars
})
require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)

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

// Set up sessions
app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true 
}))

// Register Flash messages
app.use(flash())

// Register Flash middleware
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

// Import in routes
const landingRoutes = require('./routes/landing')
const productsRoutes = require('./routes/products')

// Use routes
app.use('/', landingRoutes)
app.use('/products', productsRoutes)

app.listen(3000, function(){
    console.log('Server started')
})