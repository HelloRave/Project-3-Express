const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products',
    idAttribute: 'product_id',
    brand: function(){
        return this.belongsTo('Brand', 'brand_id')
    },
    category: function(){
        return this.belongsTo('Category', 'category_id')
    },
    allergens: function(){
        return this.belongsToMany('Allergen', 'allergens_products', 'product_id', 'allergen_id')
    }
})

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    idAttribute: 'category_id',
    products: function(){
        return this.hasMany('Product', 'product_id')
    }
})

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    idAttribute: 'brand_id',
    products: function(){
        return this.hasMany('Product', 'product_id')
    }
})

const Allergen = bookshelf.model('Allergen', {
    tableName: 'allergens',
    idAttribute: 'allergen_id',
    products: function(){
        return this.belongsToMany('Product', 'allergens_products', 'allergen_id', 'product_id')
    }
})



const User = bookshelf.model('User', {
    tableName: 'users',
    idAttribute: 'user_id'
})

module.exports = { Product, Category, Brand, Allergen, User }