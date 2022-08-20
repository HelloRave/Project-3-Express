const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256')
    const hash = sha256.update(password).digest('base64')
    return hash
}

const generateAccessToken = (user, tokenSecret, time) => {
    return jwt.sign({
        user_id: user.get('user_id'),
        email: user.get('email'),
        first_name: user.get('first_name'),
        last_name: user.get('last_name')
    }, tokenSecret, {
        expiresIn: time
    })
}

const createUser = async (email, password, first_name, last_name) => {
    const user = await User.where({
        email: email
    }).fetch({
        require: false
    })

    if (!user) {
        const newUser = new User({
            email, first_name, last_name,
            password: getHashedPassword(password)
        })
        await newUser.save()
        return newUser
    } else {
        return false
    }
}

const verifyUser = async (email, password) => {
    const user = await User.where({
        email: email
    }).fetch({
        require: false
    })

    if (user) {
        if (user.get('password') === getHashedPassword(password)) {
            const userSession = {
                id: user.get('user_id'),
                role_id: user.get('user_role_id'),
                email: user.get('email'),
                firstName: user.get('first_name'),
                lastName: user.get('last_name')
            }

            return userSession
        } else {
            return false
        }
    } else {
        return false
    }

}

const getAllUsers = async() => {
    return await User.fetchAll()
}

const getUser = async(userId) => {
    return await User.where({
        user_id: userId
    }).fetch({
        require: true
    })
}

module.exports = {
    getHashedPassword, generateAccessToken,
    verifyUser, createUser,
    getAllUsers, getUser
}