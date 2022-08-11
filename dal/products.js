const {Product, Brand, Allergen, Category} = require('../models')

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

module.exports = { getAllBrands, getAllAllergens, getAllCategories, getProductById }