const express = require('express')
const { getOrderByUserId } = require('../../dal/orders')
const router = express.Router()

router.get('/', async function(req, res){
    try {
        const user = req.user
        const orders = await getOrderByUserId(user.user_id)
        res.send(orders)
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router