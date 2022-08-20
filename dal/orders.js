const { Status, Order, OrderItem, Address } = require("../models")

const getOrderByOrderId = async (orderId) => {
    return await Order.where({
        order_id: orderId
    }).fetch({
        require: false,
        withRelated: ['user', 'status', 'address']
    })
}

const getOrderItems = async (userId) => {
    return await OrderItem.where({
        user_id: userId
    }).fetchAll({
        require: false,
        withRelated: ['variant']
    })
}

const getAllStatuses = async () => {
    return await Status.fetchAll().map(status => {
        return [status.get('status_id'), status.get('status_name')]
    })
}
const updateOrderStatus = async (orderId, newStatus) => {
    const order = await getOrderByOrderId(orderId)
    order.set('status_id', newStatus)
    await order.save()
    return order
}

const createAddress = async(address) => {
    const address = new Address({
        address_line_1: address.line1, //stripeSession.customer_details.address
        address_line_2: address.line2,
        country: address.country,
        state: address.state,
        city: address.city,
        postal_code: address.postal_code  
    })
    await address.save()
    return address
}

const createOrder = async(stripeSession, addressId) => {
    const order = new Order({
        total_cost: stripeSession.amount_total,
        order_date: new Date().toISOString().slice(0, 10),
        payment_ref: stripeSession.payment_intent,
        address_id: addressId,
        status_id: 1,
        user_id: stripeSession.metadata.user_id 
    })

    await order.save()
    return order
}

const createOrderItem = async(quantity, variant_id, order_id) => {
    const orderItem = new OrderItem({
        quantity, variant_id, order_id
    })
    await orderItem.save();
    return orderItem
}

module.exports = { getOrderByOrderId, getOrderItems, getAllStatuses, updateOrderStatus, createAddress, createOrder, createOrderItem }