const express = require('express')
const { createLoginForm, bootstrapField } = require('../../forms')
const userDataLayer = require('../../dal/users')
const router = express.Router()

router.get('/login', async function(req, res){
    const loginForm = createLoginForm();
    res.render('landing/login', {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.post('/login', async function(req, res){
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async function(form){
            const user = await userDataLayer.verifyUser(form.data.email, form.data.password);
            if (user && user.role_id == 2) {
                req.session.user = user 
                req.flash('success_messages', `Welcome back ${user.firstName} ${user.lastName}`)
                res.redirect('/') 
            } else {
                req.flash('error_messages', 'Sorry, authentication failed')
                res.redirect('/admin/login')
            }
        },
        error: function(form){
            req.flash('error_messages', 'Please fill in form again')
            res.render('landing/login', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            req.flash('error_messages', 'Please fill in form again')
            res.render('landing/login', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/logout', function(req, res){
    req.session.user = null
    req.flash('success_messages', 'See you')
    res.redirect('/admin/login')
})

module.exports = router