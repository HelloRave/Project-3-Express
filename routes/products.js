const express = require('express');
const { createProductForm, bootstrapField } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');
const dataLayer = require('../dal/products')
const router = express.Router()

const {Product} = require('../models')

router.get('/', async function(req, res){
    const products = await Product.collection().fetch({
        withRelated: ['brand', 'category', 'allergens']
    });
    res.render('products/index', {
        products: products.toJSON()
    })
})

router.get('/create', checkIfAuthenticated, async function(req, res){
    
    const brand = await dataLayer.getAllBrands()
    const category = await dataLayer.getAllCategories()
    const allergen = await dataLayer.getAllAllergens()

    const productForm = createProductForm(brand, category, allergen);
    res.render('products/create', {
        form: productForm.toHTML(bootstrapField)
    })
})

router.post('/create', checkIfAuthenticated, async function(req, res){
    
    const brand = await dataLayer.getAllBrands()
    const category = await dataLayer.getAllCategories()
    const allergen = await dataLayer.getAllAllergens()

    const productForm = createProductForm(brand, category, allergen)
    productForm.handle(req, {
        success: async function(form){
            const {allergens, ...productData} = form.data
            const product = new Product(productData)
            await product.save()

            if (allergens) {
                await product.allergens().attach(allergens.split(','))
            }

            req.flash('success_messages', `New Product ${product.get('product_name')} has been created`)
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

router.get('/:product_id/update', checkIfAuthenticated, async function(req,res){
    
    const product = await dataLayer.getProductById(req.params.product_id)
    const brand = await dataLayer.getAllBrands()
    const category = await dataLayer.getAllCategories()
    const allergen = await dataLayer.getAllAllergens()

    const productForm = createProductForm(brand, category, allergen);

    productForm.fields.product_name.value = product.get('product_name')
    productForm.fields.description.value = product.get('description')
    productForm.fields.cost.value = product.get('cost')
    productForm.fields.serving_size.value = product.get('serving_size')
    productForm.fields.brand_id.value = product.get('brand_id')
    productForm.fields.category_id.value = product.get('category_id')

    let selectedAllergens = await product.related('allergens').pluck('allergen_id')
    productForm.fields.allergens.value = selectedAllergens

    res.render('products/update', {
        form: productForm.toHTML(bootstrapField),
        product: product.toJSON()
    })
})

router.post('/:product_id/update', checkIfAuthenticated, async function(req, res){
    
    const product = await dataLayer.getProductById(req.params.product_id)
    const brand = await dataLayer.getAllBrands()
    const category = await dataLayer.getAllCategories()
    const allergen = await dataLayer.getAllAllergens()

    const productForm = createProductForm(brand, category, allergen);
    productForm.handle(req, {
        success: async function(form){
            let {allergens, ...productData} = form.data
            product.set(productData)
            product.save()

            if (allergens){
                let allergenIds = allergens.split(',')
                let existingAllergenIds = await product.related('allergens').pluck('id')
    
                let toRemove = existingAllergenIds.filter( id => {
                    return !allergenIds.includes(id)
                })
    
                await product.allergens().detach(toRemove)
    
                await product.allergens().attach(allergenIds)
            }
            
            res.redirect('/products')
        },
        error: function(form){
            res.render('products/update', {
                form: form.toHTML(bootstrapField),
                product: product.toJSON()
            })
        },
        empty: function(form){
            res.render('products/update', {
                form: form.toHTML(bootstrapField),
                product: product.toJSON()
            })
        }
    })
})

router.get('/:product_id/delete', checkIfAuthenticated, async function(req, res){
    const product = await Product.where({
        product_id: req.params.product_id
    }).fetch({
        require: true
    })

    res.render('products/delete', {
        product: product.toJSON()
    })
})

router.post('/:product_id/delete', checkIfAuthenticated, async function(req, res){
    const product = await Product.where({
        product_id: req.params.product_id
    }).fetch({
        require: true
    })

    await product.destroy()
    res.redirect('/products')
})

module.exports = router 