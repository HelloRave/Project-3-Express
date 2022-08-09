const express = require('express')
const { createUserForm, bootstrapField, createLoginForm } = require('../forms');
const { User } = require('../models');
const router = express.Router()

router.get('/register', function (req, res) {
    const registerForm = createUserForm();
    res.render('users/register', {
        form: registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', function (req, res) {
    const registerForm = createUserForm();
    registerForm.handle(req, {
        success: async function (form) {
            let { confirm_password, ...userData } = form.data
            const user = new User(userData)
            await user.save()
            req.flash('success_messages', 'User signed up successfully')
            res.redirect('/user/login')
        },
        error: function (form) {
            res.render('users/register', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: function (form) {
            res.render('users/register', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/login', function (req, res) {
    const loginForm = createLoginForm()
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', function (req, res) {
    const loginForm = createLoginForm()
    loginForm.handle(req, {
        success: async function(form){
            let user = await User.where({
                email: form.data.email
            }).fetch({
                require: false
            })

            if (!user) {
                req.flash('error_messages', 'Sorry, authentication failed')
                res.redirect('/user/login')
            } else {
                if (user.get('password') === form.data.password) {
                    req.session.user = {
                        id: user.get('user_id'),
                        email: user.get('email'),
                        lastName: user.get('last_name')
                    }
                    req.flash('success_messages', `Welcome back ${user.get('first_name')} ${user.get('last_name')}`)
                    res.redirect('/user/profile')
                } else {
                    req.flash('error_messages', 'Sorry, authentication failed')
                    res.redirect('/user/login')
                }
            }
        },
        error: function(form){
            req.flash('error_messages', 'Please fill in form again')
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            req.flash('error_messages', 'Please fill in form again')
            res.render('users/login', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
    
})

router.get('/profile', function(req,res){
    const user = req.session.user

    if (!user) {
        req.flash('error_messages', 'You do not have permissions to view')
        res.redirect('/user/login')
    } else {
        res.render('users/profile', {
            user
        })
    }
})

router.get('/logout', function(req, res){
    req.session.user = null
    req.flash('success_messages', 'See you')
    res.redirect('/user/login')
})

module.exports = router 