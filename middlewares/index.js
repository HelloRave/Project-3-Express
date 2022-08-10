const checkIfAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next()
    } else {
        req.flash('error_messages', 'You need to sign in to access')
        res.redirect('/user/login')
    }
}

module.exports = {checkIfAuthenticated}