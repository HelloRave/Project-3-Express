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

    async addOrder(){
        const address = await orderDataLayer.createAddress(

        )

        const order = await orderDataLayer.createOrder(

        )

    }

    async deleteOrder(){

    }

    async updateOrderStatus(newStatus){
        return await orderDataLayer.updateOrderStatus(this.order_id, newStatus)
    }
}

module.exports = OrderServices