const express = require('express')
const router = express.Router();
const productDataLayer = require('../../dal/products')

router.get('/', async function(req, res){
    try {
        const products = await productDataLayer.getAllProducts();
        res.json(products)
    } catch {
        res.sendStatus(500)
    }
    
})

router.post('/', async function(req, res){

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