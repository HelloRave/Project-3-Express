const {Product, Brand, Allergen, Category, Variant} = require('../models')

// =================================================
// =========== Product Data Access Layer ===========
// =================================================

const getAllBrands = async () => {
    return await Brand.fetchAll().map((brand) => {
        return [brand.get('brand_id'), brand.get('brand_name')]
    })
}

const getAllCategories = async () => {
    return await Category.fetchAll().map((category) => {
        return [category.get('category_id'), category.get('category_name')]
    })
}

const getAllAllergens = async () => {
    return await Allergen.fetchAll().map((allergen) => {
        return [allergen.get('allergen_id'), allergen.get('allergen_name')]
    })
}

const getProductById = async (productId) => {
    return await Product.where({
        product_id: Number(productId)
    }).fetch({
        require: true,
        withRelated: ['brand', 'category', 'allergens']
    })
}

const getAllProducts = async () => {
    return await Product.fetchAll({
        withRelated: ['brand', 'category', 'allergens']
    })
}

// =================================================
// ======= Product Variant Data Access Layer =======
// =================================================

const getVariantsByProductId = async (productId) => {
    return await Variant.where({
        product_id: productId
    }).fetchAll({
        require: false, 
        withRelated: ['product', 'flavour']
    })
}

const getVariantsById = async (variantId) => {
    return await Variant.where({
        variant_id: variantId
    }).fetchAll({
        require: true, 
        withRelated: ['product', 'flavour']
    })
}

module.exports = { 
    getAllBrands, getAllAllergens, getAllCategories, getProductById, getAllProducts,
    getVariantsByProductId, getVariantsById 
}