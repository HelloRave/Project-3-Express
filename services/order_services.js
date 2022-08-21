const orderDataLayer = require('../dal/orders')
const { getVariantsById } = require('../dal/products')

class OrderServices {
    constructor(order_id){
        this.order_id = order_id
    }

    async getOrder(){
        return await orderDataLayer.getOrderByOrderId(this.order_id)
    }

    async getOrderItems(){
        return await orderDataLayer.getOrderItems(this.order_id)
    }

    async addOrder(stripeSession){
        const address = await orderDataLayer.createAddress(
            stripeSession.customer_details.address
        )

        const order = await orderDataLayer.createOrder(
            stripeSession, address.toJSON().address_id
        )

        const orderItems = JSON.parse(stripeSession.metadata.orders)
        for (let orderItem of orderItems) {
            await orderDataLayer.createOrderItem(
                orderItem['quantity'],
                orderItem['variant_id'],
                order.toJSON().order_id
            )
        }
    }

    async deleteOrder(){
        const order = await orderDataLayer.getOrderByOrderId(this.order_id)
        const orderItems = await orderDataLayer.getOrderItems(this.order_id)

        if (orderItems.toJSON().length !== 0) {
            for (let orderItem of orderItems.toJSON()) {
                const variant = await getVariantsById(orderItem.variant_id)
                variant.set('stock', variant.get('stock') + orderItem.quantity)
                await variant.save()
            }
        }
        await orderDataLayer.deleteOrder(this.order_id)
        await orderDataLayer.deleteAddress(order.get('address_id'))
    }

    async updateOrderStatus(newStatus){
        return await orderDataLayer.updateOrderStatus(this.order_id, newStatus)
    }
}

module.exports = OrderServices