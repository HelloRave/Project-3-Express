const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products');
const { Product } = require('../../models');

router.get('/', async function(req, res){
    try {
        const products = await productDataLayer.getAllProducts();
        res.json(products)
    } catch {
        res.sendStatus(500)
    }
    
})

router.post('/', async function(req, res){
    try {
        let query = Product.collection()
        if (!Object.keys(req.body).length) {
            const products = await query.fetch({
                withRelated: ['brand', 'category', 'allergens', 'variants', 'variants.flavour']
            })
            res.json(products)
        } else {
            if (req.body.product_name) {
                query.where('product_name', 'like', `%${req.body.product_name}%`)
            }
            if (req.body.min_cost) {
                query.where('cost', '>=', req.body.min_cost)
            }
            if (req.body.max_cost) {
                query.where('cost', '<=', req.body.max_cost)
            }
            if (req.body.min_serving_size) {
                query.where('serving_size', '>=', req.body.min_serving_size)
            }
            if (req.body.max_serving_size) {
                query.where('serving_size', '<=', req.body.max_serving_size)
            }
            if (req.body.category_id) {
                query.where('category_id', '=', req.body.category_id)
            }
            if (req.body.brand_id) {
                query.where('brand_id', '=', req.body.brand_id)
            }
            if (req.body.allergen_id) {
                query.query('join', 'allergens_products', 'products.product_id', 'allergens_products.product_id')
                .where('allergen_id', 'in', req.body.allergen_id.split(','))
            }
            if (req.body.flavour_id) {
                query.query('join', 'variants', 'products.product_id', 'variants.product_id')
                .where('flavour_id', '=', req.body.flavour_id)
            }

            const products = await query.fetch({
                withRelated: ['brand', 'category', 'allergens', 'variants', 'variants.flavour']
            })
            res.json(products)
        }

    } catch {
        res.sendStatus(500)
    }
})

router.get('/:product_id/variants', async function(req, res){
    try {
        const product = await productDataLayer.getProductById(req.params.product_id)
        const variants = await productDataLayer.getVariantsByProductId(req.params.product_id)
        res.send({
            product, variants
        })
    } catch {
        res.sendStatus(500)
    }
})

module.exports = router 