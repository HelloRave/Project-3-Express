const express = require('express')
const { createLoginForm } = require('../forms')
const userDataLayer = require('../dal/users')
const router = express.Router()

router.get('/login', async function(req, res){
    const loginForm = createLoginForm();
    res.render('users/login', {
        form: loginForm.toHTML(bootstrapField)
    })
})

router.get('/login', async function(req, res){
    const loginForm = createLoginForm();
    loginForm.handle(req, {
        success: async function(form){

        },
        error: function(form){
            const user = await userDataLayer.verifyUser(form.data.email, form.data.password);
            
        },
        empty: function(form){

        }
    })
})

module.exports = router