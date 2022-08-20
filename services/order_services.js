const orderDataLayer = require('../dal/orders')

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

    }

    async updateOrderStatus(newStatus){
        return await orderDataLayer.updateOrderStatus(this.order_id, newStatus)
    }
}

module.exports = OrderServices