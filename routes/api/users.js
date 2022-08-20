const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createUser, generateAccessToken, getHashedPassword } = require('../../dal/users');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const { User, BlacklistedToken } = require('../../models');

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
        const accessToken = generateAccessToken(user.toJSON(), process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateAccessToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '7d')
        res.json({
            accessToken, refreshToken
        })
    } else {
        res.sendStatus(403)
    }
})

router.post('/login', async function(req, res){
    const user = await User.where({
        email: req.body.email
    }).fetch({
        require: false
    })

    if (user && user.get('password') === getHashedPassword(req.body.password)) {
        const accessToken = generateAccessToken(user.toJSON(), process.env.TOKEN_SECRET, '1h')
        const refreshToken = generateAccessToken(user.toJSON(), process.env.REFRESH_TOKEN_SECRET, '7d')
        res.json({
            accessToken, refreshToken
        })
    } else {
        res.sendStatus(401)
    }

})

router.get('/profile', checkIfAuthenticatedJWT, async function(req, res){
    const user = req.user
    res.send(user)
})

router.post('/refresh', async function(req,res){
    const refreshToken = req.body.refreshToken;

    const blacklistedToken = await BlacklistedToken.where({
        token: refreshToken
    }).fetch({
        require: false
    })

    if (blacklistedToken) {
        res.status(400);
        res.json({
            error: 'Invalid refresh token'
        })
        return; 
    }

    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function(err, user){
            if (!err) {
                const accessToken = generateAccessToken(user, process.env.TOKEN_SECRET, '1h');
                res.json({
                    accessToken
                })
            } else {
                res.status(400);
                res.json({
                    error: 'Invalid refresh token'
                })
            }
        })
    } else {
        res.sendStatus(400)
    }
})

router.post('/logout', async function(req, res){
    const refreshToken = req.body.refreshToken

    if (refreshToken) {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async function(err, user){
            if (!err) {
                const token = new BlacklistedToken();
                token.set('token', refreshToken);
                token.set('date_created', new Date());
                await token.save()
                res.json({
                    message: 'Logged out'
                })
            }
        })
    } else {
        res.status(400);
        res.json({
            error: 'No refresh token found'
        })
    }
})

module.exports = router 