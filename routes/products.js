const express = require('express');
const { createProductForm, bootstrapField } = require('../forms');
const router = express.Router()

const {Product} = require('../models')

router.get('/', async function(req, res){
    const products = await Product.collection().fetch();
    res.render('products/index', {
        products: products.toJSON()
    })
})

router.get('/create', async function(req, res){
    const productForm = createProductForm();
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', function(req, res){
    const productForm = createProductForm()
    productForm.handle(req, {
        success: async function(form){
            const product = new Product(form.data)
            await product.save()
            res.redirect('/products')
        },
        error: function(form){
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        },
        empty: function(form){
            res.render('products/create', {
                form: form.toHTML(bootstrapField)
            })
        }
    })
})

router.get('/:product_id/update', async function(req,res){
    const product = await Product.where({
        product_id: req.params.product_id
    }).fetch({
        require: true
    })

    const productForm = createProductForm();

    productForm.fields.product_name.value = product.get('product_name')
    productForm.fields.description.value = product.get('description')
    productForm.fields.cost.value = product.get('cost')
    productForm.fields.serving_size.value = product.get('serving_size')

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})

module.exports = router 