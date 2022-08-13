const cartDataLayer = require('../dal/cart_items')
const { getVariantsById } = require('../dal/products')

class CartServices {
    constructor(user_id) {
        this.user_id = user_id
    }

    // Get all cart items for a user
    async getCart() {
        return await cartDataLayer.getCart(this.user_id)
    }

    // Add product variant to cart
    async addToCart(variantId, quantity){
        const cartItem = await cartDataLayer.getCartItemByUserAndVariant(this.user_id, variantId)
        const variant = await getVariantsById(variantId)
        const variantStock = variant.get('stock')

        if (cartItem && variantStock >= quantity) {
            variant.set('stock', variantStock - quantity)
            await variant.save()
            return await cartDataLayer.updateCartItemQuantity(
                this.user_id, 
                variantId,
                cartItem.get('quantity') + quantity
            )
        }
        else if (!cartItem && variantStock >= quantity) {
            let newCartItem = cartDataLayer.createCartItem(
                this.user_id,
                variantId,
                quantity
            )
            variant.set('stock', variantStock - quantity)
            await variant.save()
            return newCartItem
        }
        else if (variantStock < quantity) {
            return false
        }
    }

    // Remove product variant from cart
    async removeFromCart(variantId){
        const cartItem = await cartDataLayer
            .getCartItemByUserAndVariant(this.user_id, variantId)
        const cartItemQuantity = cartItem.get('quantity')
        const variant = await getVariantsById(variantId)
        const variantStock = variant.get('stock')

        variant.set('stock', variantStock + cartItemQuantity)
        await variant.save()
        return await cartDataLayer.removeCartItem(this.user_id, variantId)
    }

    // Update product variant quantity in cart
    async updateQuantity(variantId, newQuantity){
        const cartItem = await cartDataLayer
            .getCartItemByUserAndVariant(this.user_id, variantId)
        const cartItemQuantity = cartItem.get('quantity')
        const variant = await getVariantsById(variantId)
        const variantStock = variant.get('stock')

        if (newQuantity >= cartItemQuantity) {
            if (variantStock >= (newQuantity - cartItemQuantity)) {
                variant.set('stock', variantStock - (newQuantity - cartItemQuantity))
            } else {
                return false
            }
        }
        else {
            variant.set('stock', variantStock + (cartItemQuantity - newQuantity))
        }
        await variant.save()
        await cartDataLayer.updateCartItemQuantity(
            this.user_id,
            variantId,
            newQuantity
        )
    }
}


module.exports = CartServices