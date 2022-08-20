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
    },
    variants: function(){
        return this.hasMany('Variant', 'product_id')
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

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    idAttribute: 'variant_id',
    product: function(){
        return this.belongsTo('Product', 'product_id')
    },
    flavour: function(){
        return this.belongsTo('Flavour', 'flavour_id')
    },
    cartItems: function(){
        return this.hasMany('CartItem', 'variant_id')
    },
    orderItems: function(){
        return this.hasMany('OrderItem', 'variant_id')
    }
})

const Flavour = bookshelf.model('Flavour', {
    tableName: 'flavours',
    idAttribute: 'flavour_id',
    variants: function(){
        return this.hasMany('Variant', 'variant_id')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users',
    idAttribute: 'user_id',
    cartItems: function(){
        return this.hasMany('CartItem', 'user_id')
    },
    orders: function(){
        return this.hasMany('Order', 'user_id')
    },
    userRole: function(){
        return this.belongsTo('UserRole', 'user_role_id')
    }
})

const UserRole = bookshelf.model('UserRole', {
    tableName: 'user_roles',
    idAttribute: 'user_role_id',
    users: function(){
        return this.hasMany('User', 'user_id')
    }
})

const CartItem = bookshelf.model('CartItem', {
    tableName: 'cart_items',
    idAttribute: 'cart_item_id',
    variant: function(){
        return this.belongsTo('Variant', 'variant_id')
    },
    user: function(){
        return this.belongsTo('User', 'user_id')
    }
})

const OrderItem = bookshelf.model('OrderItem', {
    tableName: 'order_items',
    idAttribute: 'order_item_id',
    variant: function(){
        return this.belongsTo('Variant', 'variant_id')
    },
    order: function(){
        return this.belongsTo('Order', 'order_id')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    idAttribute: 'order_id',
    orderItems: function(){
        return this.hasMany('OrderItem', 'order_id')
    },
    status: function(){
        return this.belongsTo('Status', 'status_id')
    },
    address: function(){
        return this.belongsTo('Address', 'address_id')
    },
    user: function(){
        return this.belongsTo('User', 'user_id')
    }
})

const Status = bookshelf.model('Status', {
    tableName: 'statuses',
    idAttribute: 'status_id',
    orders: function(){
        return this.hasMany('Order', 'order_id')
    }
})

const Address = bookshelf.model('Address', {
    tableName: 'addresses',
    idAttribute: 'address_id',
    orders: function(){
        return this.hasMany('Order', 'order_id')
    }
})

const BlacklistedToken = bookshelf.model('BlacklistedToken', {
    tableName: 'blacklisted_tokens'
})

module.exports = { 
    Product, Category, Brand, Allergen, Variant, Flavour, 
    User, CartItem, OrderItem, Order, Status, Address,
    UserRole, BlacklistedToken 
}