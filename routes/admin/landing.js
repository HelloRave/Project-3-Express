const express = require('express')
const router = express.Router()

router.get('/', function(req, res){
    if (req.session.user) {
        res.redirect('/orders')
    } else {
        res.redirect('/admin/login')
    }
})

module.exports = router