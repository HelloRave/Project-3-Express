const { Status, Order, OrderItem, Address } = require("../models")

const getOrderByOrderId = async (orderId) => {
    return await Order.where({
        order_id: orderId
    }).fetch({
        require: false,
        withRelated: ['user', 'status', 'address']
    })
}

const getOrderItems = async (orderId) => {
    return await OrderItem.where({
        order_id: orderId
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

const createAddress = async() => {
    const address = new Address({
        // Insert here
    })
    await address.save()
    return address
}

const createOrder = async() => {
    const order = new Order({
        // Column names of Order model 
    })

    await order.save()
    return order
}

module.exports = { getOrderByOrderId, getOrderItems, getAllStatuses, updateOrderStatus, createAddress, createOrder }