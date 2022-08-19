const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, generateAccessToken } = require('../../dal/users');
const { checkIfAuthenticatedJWT } = require('../../middlewares');

router.post('/register', async function(req,res){
    const newUser = await createUser(
        req.body.email,
        req.body.password,
        req.body.first_name,
        req.body.last_name
    )

    if (newUser) {
        const user = await User.where({
            email: req.body.email
        }).fetch({
            require: false
        })
        const accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h')
        res.send(accessToken)
    } else {
        res.sendStatus(403)
    }
})

router.post('/login', async function(req, res){

})

router.get('/profile', checkIfAuthenticatedJWT, async function(req, res){

})



module.exports = router 