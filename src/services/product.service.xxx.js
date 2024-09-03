'use strict'

const { product, clothing, electronic, furniture } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')

// define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing', or 'Electronics or 'Furniture'
        payload
    */

    static productRegistry = {
        // key-class
    }

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {

        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid type ${type}`)

        return new productClass(payload).createProduct()
    }

    static async updateProduct(type, productId, payload) {

        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // publish product 
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    // unpublish product 
    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // query
    /**
     * @desc get all drafts
     * @param {Object} product_shop
     * @param {Number} limit
     * @param {Number} skip
     */
    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }


    /**
     * @desc get all publish
     */
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true, isDraft: false }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProducts({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({
            limit,
            sort,
            page,
            filter,
            select: [
                'product_name',
                'product_price',
                'product_thumb'
            ]
        })
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v'] })
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({...this, _id: product_id })
    }

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// define sub-class for different product types Clothing
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newClothing) throw new BadRequestError('Create new clothing failed')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new product failed')

        return newProduct
    }

    async updateProduct(productId) {
        /*
            Constraints: data is truth
        */

        // 1. Remove attributes is underfine of null
        // console.log(`[1]::`, this);
        const objectParams = removeUndefinedObject(this);
        // console.log(`[2]::`, objectParams);

        // 2. Check where at update?
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing
            })
        }

        // update parent
        const updateProduct = await super.updateProduct(
            productId,
            updateNestedObjectParser(objectParams)
        )

        return updateProduct
    }
}

// define sub-class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new electronic failed')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new product failed')

        return newProduct
    }

    async updateProduct(productId) {
        /*
            Constraints: data is truth
        */

        // 1. Remove attributes is underfine of null
        const objectParams = this;
        // 2. Check where at update?
        if (objectParams.product_attributes) {
            // update child
            await updateProductById({ productId, objectParams, model: electronic })
        }

        const updateProduct = await super.updateProduct(productId, objectParams)

        return updateProduct
    }
}

// define sub-class for different product types Furniture
class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new furniture failed')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new product failed')

        return newProduct
    }
}

// register product types
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Furniture', Furniture);
// if have new product then add on here

module.exports = ProductFactory