const express = require('express')
const { checkIfAuthenticatedJWT } = require('../../middlewares')
const CartServices = require('../../services/cart_services')
const router = express.Router()

const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27"
})

router.get('/', checkIfAuthenticatedJWT, async function(req, res){
    const user = req.user
    const cart = new CartServices(user.user_id)
    const cartItems = await cart.getCart()

    // 1. Create line items
    let lineItems = [];
    let meta = [];
    for (let cartItem of cartItems) {
        const lineItem = {
            name: cartItem.related('variant').related('product').get('product_name'),
            images: [cartItem.related('variant').get('product_image_url')],
            amount: cartItem.related('variant').related('product').get('cost'),
            quantity: cartItem.get('quantity'),
            currency: 'SGD'
        }

        lineItems.push(lineItem)

        meta.push({
            variant_id: cartItem.get('variant_id'),
            quantity: cartItem.get('quantity')
        })
    }

    console.log(lineItems, meta)

    // 2. Create stripe payment
    let metaData = JSON.stringify(meta)
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionsId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            orders: metaData
        }
    }

    // 3. Register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.send({
        sessionId: stripeSession.id,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })

})

// Webhook for Stripe
router.post('/process_payment', express.raw({
    type: 'application/json'
}), async function(req, res){
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers['stripe-signature'];
    let event;
    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret)
    } 
    catch(e){
        res.send({
            error: e.message
        })
    }

    if (event.type === 'checkout.session.completed') {
        let stripeSession = event.data.object
        console.log(stripeSession)
        let cartServices = new CartServices(stripeSession.metadata.user_id)
        await cartServices.checkoutCart(stripeSession)
        // To continue
    }

    res.send({
        received: true
    })
})

module.exports = router 