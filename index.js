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
const csrf = require('csurf')

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

// Enable csrf protection
const csrfInstance = csrf();
app.use(function(req,res,next){
  if (req.url === '/checkout/process_payment' || req.url.slice(0,5) == '/api/') {
    next();
  } else {
    csrfInstance(req,res,next);
  }
})

// Register Flash messages
app.use(flash())

app.use(function(req, res, next){
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

// CSRF error handling
app.use((err, req, res, next) => {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'The form has expired. Please try again.');
        res.redirect('back');
    } else {
        next()
    }
})

// Register Flash middleware
app.use(function(req, res, next){
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    next();
})

// Share the user data with hbs files 
app.use(function(req,res,next){
    res.locals.user = req.session.user;
    next();
})

// Import in routes
const landingRoutes = require('./routes/landing')
const productsRoutes = require('./routes/products')
const userRoutes = require('./routes/users')

const api = {
    products: require('./routes/api/products')
}

// Use routes
app.use('/', landingRoutes)
app.use('/products', productsRoutes)
app.use('/user', userRoutes)

// API routes
app.use('/api/products', express.json(), api.products)

app.listen(3000, function(){
    console.log('Server started')
})