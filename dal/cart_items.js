const { CartItem } = require("../models")

const getCart = async(userId) => {
    return await CartItem.collection().where({
        user_id: userId
    }).fetch({
        require: false,
        withRelated: ['variant', 'user', 'variant.product', 'variant.flavour']
    })
}

const getCartItemByUserAndVariant = async(userId, variantId) => {
    return await CartItem.where({
        user_id: userId,
        variant_id: variantId
    }).fetch({
        require: false
    })
}

const createCartItem = async(userId, variantId, quantity) => {
    const cartItem = new CartItem({
        user_id: userId,
        variant_id: variantId,
        quantity
    })
    await cartItem.save()
    return cartItem
}
const removeCartItem = async(userId, variantId) => {
    let cartItem = await getCartItemByUserAndVariant(userId, variantId);
    if (cartItem) {
        await cartItem.destroy()
        return true
    }
    return false
}

const updateCartItemQuantity = async(userId, variantId, newQuantity) => {
    let cartItem = await getCartItemByUserAndVariant(userId, variantId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity)
        cartItem.save()
        return true
    }
    return false
}

module.exports = { getCart, getCartItemByUserAndVariant, createCartItem, removeCartItem, updateCartItemQuantity }