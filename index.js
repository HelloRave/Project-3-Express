// Require dependencies 
const express = require('express');
const hbs = require('hbs')
const wax = require('wax-on')
require('handlebars-helpers')({
    handlebars: hbs.handlebars
})
const cors = require('cors')
require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
const csrf = require('csurf')

// Create instance of express app
let app = express()

// Set view engine
app.set('view engine', 'hbs')

// enable cross-site origin resources sharing
app.use(cors());

// Static folder 
app.use(express.static('public'))

hbs.registerPartials('./views/partials')

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
const admin = {
    landing: require('./routes/admin/landing'),
    products: require('./routes/admin/products'),
    users: require('./routes/admin/users'),
    login: require('./routes/admin/admin_login'),
    cloudinary: require('./routes/admin/cloudinary')
}

const api = {
    products: require('./routes/api/products'),
    users: require('./routes/api/users'),
    checkout: require('./routes/api/checkout')
}

// Use routes
app.use('/', admin.landing)
app.use('/products', admin.products)
app.use('/admin', admin.login)
app.use('/cloudinary', admin.cloudinary)

// API routes
app.use('/api/products', express.json(), api.products)
app.use('/api/users', express.json(), api.users)
app.use('/api/checkout', api.checkout)

app.listen(8080, function(){
    console.log('Server started')
})