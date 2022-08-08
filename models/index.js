const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products',
    idAttribute: 'product_id'
})

module.exports = { Product }