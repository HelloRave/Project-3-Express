const express = require('express')
const CartServices = require('../../services/cart_services')
const router = express.Router()

router.get('/', async function(req, res){
    try {
        let user = req.user
        let cartServices = new CartServices(user.user_id)
        res.send(await cartServices.getCart())
    } 
    catch {
        res.sendStatus(500)
    }
})

router.post('/:variant_id/add', async function(req, res){
    try {
        let user = req.user
        let cartServices = new CartServices(user.user_id)
        let addResponse = await cartServices.addToCart(
            req.params.variant_id, req.body.quantity
        )
    
        if (addResponse) {
            res.send(`Variant ID: ${req.params.variant_id} added to cart; Quantity: ${req.body.quantity}`)
        }
        else {
            res.sendStatus(403)
        }
    } 
    catch {
        res.sendStatus(500)
    }
    
})

router.post('/:variant_id/update/quantity', async function(req, res){
    try {
        let user = req.user
        let cartServices = new CartServices(user.user_id)
        let updateQuantityResponse = await cartServices.updateQuantity(
            req.params.variant_id, req.body.newQuantity
        )

        if (updateQuantityResponse) {
            res.send(`Variant ID: ${req.params.variant_id} new quantity: ${req.body.newQuantity}`)
        }
        else {
            res.sendStatus(403)
        }
        
    }
    catch {
        res.sendStatus(500)
    }
})

router.post('/:variant_id/delete', async function(req, res){
    try {
        let user = req.user
        let cartServices = new CartServices(user.user_id)
        await cartServices.removeFromCart(req.params.variant_id)
        res.send(`Variant ID: ${req.params.variant_id} deleted from cart`)
    }
    catch {
        res.sendStatus(500)
    }
})

module.exports = router