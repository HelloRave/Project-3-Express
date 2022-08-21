const express = require('express')
const router = express.Router()
const orderDataLayer = require('../../dal/orders')
const { createOrderSearchForm, bootstrapField, createStatusForm } = require('../../forms')
const { Order, User } = require('../../models')
const OrderServices = require('../../services/order_services')

router.get('/', async function(req, res){
    const status = await orderDataLayer.getAllStatuses()
    status.unshift([0, '--- Select Status ---'])

    const orderSearchForm = createOrderSearchForm(status)
    let query = Order.collection()

    orderSearchForm.handle(req, {
        success: async function(form){
            if (form.data.order_id) {
                query.where('order_id', '=', form.data.order_id)
            }
            if (form.data.email) {
                const user = await User.where({
                    email: form.data.email
                }).fetch({
                    require: false
                })

                if (user) {
                    query.where('user_id', '=', user.get('user_id'))
                } else {
                    query.where('user_id', '=', '0')
                }
            }
            if (form.data.order_date) {
                query.where('order_date', '=', form.data.order_date)
            }
            if (form.data.status_id) {
                query.where('status_id', '=', form.data.status_id)
            }

            const orders = await query.fetch({
                withRelated: ['orderItems.variant', 'status', 'address', 'user']
            })

            const pending = orders.toJSON().filter(order => {
                return order.status_id == 1 || order.status_id == 2
            })

            const delivered = orders.toJSON().filter(order => {
                return order.status_id == 3
            })

            const completed = orders.toJSON().filter(order => {
                return order.status_id == 4
            })

            res.render('orders/index', {
                form: form.toHTML(bootstrapField),
                pending, delivered, completed
            })
        },
        error: async function(form){
            const orders = await query.fetch({
                withRelated: ['orderItems.variant', 'status', 'address', 'user']
            })

            const pending = orders.toJSON().filter(order => {
                return order.status_id == 1 || order.status_id == 2
            })

            const delivered = orders.toJSON().filter(order => {
                return order.status_id == 3
            })

            const completed = orders.toJSON().filter(order => {
                return order.status_id == 4
            })

            res.render('orders/index', {
                form: form.toHTML(bootstrapField),
                pending, delivered, completed
            })
        },
        empty: async function(form){
            const orders = await query.fetch({
                withRelated: ['orderItems.variant', 'status', 'address', 'user']
            })

            const pending = orders.toJSON().filter(order => {
                return order.status_id == 1 || order.status_id == 2
            })

            const delivered = orders.toJSON().filter(order => {
                return order.status_id == 3
            })

            const completed = orders.toJSON().filter(order => {
                return order.status_id == 4
            })

            res.render('orders/index', {
                form: form.toHTML(bootstrapField),
                pending, delivered, completed
            })
        }
    })
})

router.get('/:order_id/items', async function(req, res){
    const status = await orderDataLayer.getAllStatuses()
    const orderServices = new OrderServices(req.params.order_id)
    const order = orderServices.getOrder()
    const orderItems = orderServices.getOrderItems()
    const statusForm = createStatusForm(status)

    statusForm.fields.status_id.value = order.get('status_id')

    res.render('orders/items', {
        order: order.toJSON(),
        orderItems: orderItems.toJSON(),
        form: statusForm.toHTML(bootstrapField) // to post to route below
    })
})

router.post('/:order_id/status/update', async function(req, res){
    const orderServices = new OrderServices(req.params.order_id)
    await orderServices.updateOrderStatus(req.body.status_id)
    req.flash('success_messages', 'Order status changed.')
    res.redirect(`/orders/${req.params.order_id}/items`)
})

router.get('/:order_id/delete', async function(req, res){
    
})

router.post('/:order_id/delete', async function(req, res){

})

module.exports = router