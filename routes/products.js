const express = require('express');
const { createProductForm, bootstrapField, createVariantForm, createSearchForm } = require('../forms');
const { checkIfAuthenticated } = require('../middlewares');
const dataLayer = require('../dal/products')
const router = express.Router()

const {Product, Variant} = require('../models')

router.get('/', async function(req, res){
    
    const brand = await dataLayer.getAllBrands()
    brand.unshift([0, '--- Select Brand ---'])
    const category = await dataLayer.getAllCategories()
    category.unshift([0, '--- Select Category ---'])
    const allergen = await dataLayer.getAllAllergens()
    allergen.unshift([0, '--- Select Allergen ---'])
    const flavour = await dataLayer.getAllFlavours()
    flavour.unshift([0, '--- Select Flavour ---'])

    const searchForm = createSearchForm(category, brand, allergen, flavour)
    let query = Product.collection()

    searchForm.handle(req, {
        success: async function(form){
            if (form.data.name) {
                query.where('product_name', 'like', `%${form.data.name}%`)
            }
            if (form.data.min_cost) {
                query.where('cost', '>=', form.data.min_cost)
            }
            if (form.data.max_cost) {
                query.where('cost', '<=', form.data.max_cost)
            }
            if (form.data.min_serving_size) {
                query.where('cost', '>=', form.data.min_serving_size)
            }
            if (form.data.max_serving_size) {
                query.where('cost', '<=', form.data.max_serving_size)
            }
            if (form.data.category_id && form.data.category_id != "0") {
                query.where('category_id', '=', form.data.category_id)
            }
            if (form.data.brand_id && form.data.brand_id != "0") {
                query.where('brand_id', '=', form.data.brand_id)
            }
            if (form.data.allergen && form.data.allergen_id != "0") {
                query.query('join', 'allergens_products', 'products.product_id', 'allergens_products.product_id')
                    .where('allergen_id', 'in', form.data.allergen.split(','))
            }
            // if (form.data.flavour){

            // }
            const products = await query.fetch({
                withRelated: ['brand', 'category', 'allergens']
            })

            res.render('products/index', {
                products: products.toJSON(),
                form: form.toHTML(bootstrapField)
            })

        },
        error: async function(form){
            const products = await query.fetch({
                withRelated: ['brand', 'category', 'allergens']
            })

            res.render('products/index', {
                products: products.toJSON(),
                form: form.toHTML(bootstrapField)
            })
        },
        empty: async function(){
            const products = await query.fetch({
                withRelated: ['brand', 'category', 'allergens']
            })

            res.render('products/index', {
                products: products.toJSON(),
                form: searchForm.toHTML(bootstrapField)
            })
        }
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
            } else {
                let allergenIds = allergens.split(',')
                await product.allergens().detach(allergenIds)
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

// ================================
// ==== Product Variant Routes ====
// ================================

router.get('/:product_id/variants', async function(req, res){
    const product = await dataLayer.getProductById(req.params.product_id)
    const variants = await dataLayer.getVariantsByProductId(req.params.product_id)

    res.render('products/variants', {
        product: product.toJSON(),
        variants: variants.toJSON()
    })
})

router.get('/:product_id/variants/create', async function(req, res){
    const product = await dataLayer.getProductById(req.params.product_id)
    const flavour = await dataLayer.getAllFlavours()

    const variantForm = createVariantForm(flavour)
    res.render('products/variants-create', {
        product: product.toJSON(),
        form: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/variants/create', async function(req, res){
    const product = await dataLayer.getProductById(req.params.product_id)
    const flavour = await dataLayer.getAllFlavours()

    const variantForm = createVariantForm(flavour)
    variantForm.handle(req, {
        success: async function(form){
            const variant = new Variant({
                product_id: req.params.product_id,
                ...form.data
            })
            await variant.save()
            req.flash('success_messages', `New product variant has been created.`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        error: function(form){
            res.render('products/variants-create', {
                product: product.toJSON(),
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        empty: function(form){
            res.render('products/variants-create', {
                product: product.toJSON(),
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/update', async function(req, res){
    const variant = await dataLayer.getVariantsById(req.params.variant_id)
    const flavour = await dataLayer.getAllFlavours()

    const variantForm = createVariantForm(flavour)

    for (field in variantForm.fields) {
        variantForm.fields[field].value = variant.get(field)
    }

    res.render('products/variants-update', {
        variant: variant.toJSON(),
        form: variantForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/:product_id/variants/:variant_id/update', async function(req, res){
    const variant = await dataLayer.getVariantsById(req.params.variant_id)
    const flavour = await dataLayer.getAllFlavours()

    const variantForm = createVariantForm(flavour)

    variantForm.handle(req, {
        success: async function(form){
            variant.set(form.data)
            variant.save()

            req.flash('success_messages', `Product variant has been updated.`)
            res.redirect(`/products/${req.params.product_id}/variants`)
        },
        error: function(form){
            res.render('products/variants-update', {
                variant: variant.toJSON(),
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        },
        empty: function(form){
            res.render('products/variants-update', {
                variant: variant.toJSON(),
                form: form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })
        }
    })
})

router.get('/:product_id/variants/:variant_id/delete', async function(req, res){
    const variant = await dataLayer.getVariantsById(req.params.variant_id)
    res.render('products/variants-delete',{
        variant: variant.toJSON()
    })
})

router.post('/:product_id/variants/:variant_id/delete', async function(req,res){
    const variant = await dataLayer.getVariantsById(req.params.variant_id)
    await variant.destroy()
        req.flash('success_messages', `Product variant has been deleted.`)
        res.redirect(`/products/${req.params.product_id}/variants`)
})

module.exports = router 